const {getCollection,normalizeBody,persistFallback}=require("./_storage");
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
    const collection=await getCollection("MONGODB_WAITLIST_COLLECTION","waitlist");
    const existingEntry=await collection.findOne({email});
    if(existingEntry) return res.status(409).json({error:"This email is already on the waitlist."});
    await collection.insertOne(entry);
    return res.status(201).json({ok:true,message:"You have been added to the waitlist."});
  }catch(error){
    console.error("Waitlist primary storage failed",error);
    try{
      await persistFallback("uniogate-waitlist.ndjson",{...entry,fallback:true,fallbackAt:new Date().toISOString()},"WAITLIST_FALLBACK_ENTRY");
      return res.status(201).json({ok:true,message:"Your request has been received. Our team will confirm your place on the waitlist shortly.",fallback:true});
    }catch(fallbackError){
      console.error("Waitlist fallback storage failed",fallbackError);
      return res.status(500).json({error:"We could not save your details right now. Please try again."});
    }
  }
};
