const fsp=require("fs/promises"),os=require("os"),path=require("path"),{MongoClient}=require("mongodb");
let client;
async function getCollection(){
  const uri=process.env.MONGODB_URI;
  if(!uri) throw new Error("Missing MONGODB_URI environment variable");
  if(!client){
    client=new MongoClient(uri,{maxPoolSize:10,minPoolSize:0,serverSelectionTimeoutMS:5000});
    await client.connect();
  }
  return client.db(process.env.MONGODB_DB||"uniogate").collection(process.env.MONGODB_WAITLIST_COLLECTION||"waitlist");
}
function normalizeBody(req){
  if(!req.body) return {};
  if(typeof req.body==="string"){
    try{return JSON.parse(req.body)}catch(_){return {}}
  }
  return req.body;
}
async function persistFallback(entry){
  const filePath=path.join(os.tmpdir(),"uniogate-waitlist.ndjson");
  await fsp.appendFile(filePath,JSON.stringify(entry)+"\n","utf8");
  console.warn("WAITLIST_FALLBACK_ENTRY",JSON.stringify(entry));
}
module.exports=async function handler(req,res){
  res.setHeader("Content-Type","application/json");
  if(req.method!=="POST"){
    res.setHeader("Allow","POST");
    return res.status(405).json({error:"Method not allowed"});
  }
  const body=normalizeBody(req);
  const name=String(body.name||"").trim();
  const email=String(body.email||"").trim().toLowerCase();
  const businessType=String(body.businessType||body.business||"").trim();
  const sourcePage=String(body.sourcePage||"").trim()||"/";
  if(!name||!email||!businessType){
    return res.status(400).json({error:"Name, email, and business type are required."});
  }
  const now=new Date();
  const entry={name,email,businessType,sourcePage,createdAt:now,updatedAt:now,status:"pending"};
  try{
    const collection=await getCollection();
    const existingEntry=await collection.findOne({email});
    if(existingEntry) return res.status(409).json({error:"This email is already on the waitlist."});
    await collection.insertOne(entry);
    return res.status(201).json({ok:true,message:"You have been added to the waitlist."});
  }catch(error){
    console.error("Waitlist primary storage failed",error);
    try{
      await persistFallback({...entry,fallback:true,fallbackAt:new Date().toISOString()});
      return res.status(201).json({ok:true,message:"Your request has been received. Our team will confirm your place on the waitlist shortly.",fallback:true});
    }catch(fallbackError){
      console.error("Waitlist fallback storage failed",fallbackError);
      return res.status(500).json({error:"We could not save your details right now. Please try again."});
    }
  }
};
