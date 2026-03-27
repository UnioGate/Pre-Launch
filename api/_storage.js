const fsp=require("fs/promises");
const os=require("os");
const path=require("path");
const {MongoClient}=require("mongodb");

let client;

function normalizeBody(req){
  if(!req||!req.body) return {};
  if(typeof req.body==="string"){
    try{
      return JSON.parse(req.body);
    }catch(_error){
      return {};
    }
  }
  return req.body;
}

async function getCollection(collectionNameEnv, defaultCollectionName){
  const uri=process.env.MONGODB_URI;
  if(!uri) throw new Error("Missing MONGODB_URI environment variable");
  if(!client){
    client=new MongoClient(uri,{maxPoolSize:10,minPoolSize:0,serverSelectionTimeoutMS:5000});
    await client.connect();
  }
  const databaseName=process.env.MONGODB_DB||"uniogate";
  const collectionName=process.env[collectionNameEnv]||defaultCollectionName;
  return client.db(databaseName).collection(collectionName);
}

async function persistFallback(fileName, entry, logLabel){
  const filePath=path.join(os.tmpdir(),fileName);
  await fsp.appendFile(filePath,JSON.stringify(entry)+"\n","utf8");
  console.warn(logLabel,JSON.stringify(entry));
}

module.exports={
  getCollection,
  normalizeBody,
  persistFallback
};
