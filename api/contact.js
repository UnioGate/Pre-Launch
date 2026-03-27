const {getCollection,normalizeBody,persistFallback}=require("./_storage");

const validInquiryTypes=new Set(["partnership","developer-support","media-inquiry"]);

module.exports=async function handler(req,res){
  res.setHeader("Content-Type","application/json");
  if(req.method!=="POST"){
    res.setHeader("Allow","POST");
    return res.status(405).json({error:"Method not allowed"});
  }

  const body=normalizeBody(req);
  const inquiryType=String(body.inquiryType||"").trim().toLowerCase();
  const name=String(body.name||"").trim();
  const email=String(body.email||"").trim().toLowerCase();
  const subject=String(body.subject||"").trim();
  const message=String(body.message||"").trim();
  const sourcePage=String(body.sourcePage||"").trim()||"/";

  if(!validInquiryTypes.has(inquiryType)){
    return res.status(400).json({error:"Please choose a valid inquiry type."});
  }
  if(!name||!email||!subject||!message){
    return res.status(400).json({error:"Name, email, subject, and message are required."});
  }

  const now=new Date();
  const entry={
    inquiryType,
    name,
    email,
    subject,
    message,
    sourcePage,
    status:"new",
    createdAt:now,
    updatedAt:now
  };

  try{
    const collection=await getCollection("MONGODB_CONTACT_COLLECTION","contact_inquiries");
    await collection.insertOne(entry);
    return res.status(201).json({ok:true,message:"Your inquiry has been received. Our team will get back to you soon."});
  }catch(error){
    console.error("Contact primary storage failed",error);
    try{
      await persistFallback("uniogate-contact.ndjson",{...entry,fallback:true,fallbackAt:new Date().toISOString()},"CONTACT_FALLBACK_ENTRY");
      return res.status(201).json({ok:true,message:"Your inquiry has been received and queued for follow-up.",fallback:true});
    }catch(fallbackError){
      console.error("Contact fallback storage failed",fallbackError);
      return res.status(500).json({error:"We could not save your inquiry right now. Please try again."});
    }
  }
};
