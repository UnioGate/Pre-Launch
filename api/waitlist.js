const { MongoClient } = require("mongodb");

let cachedClient;

async function getCollection() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "uniogate";
  const collectionName = process.env.MONGODB_WAITLIST_COLLECTION || "waitlist";

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 0
    });
    await cachedClient.connect();
  }

  return cachedClient.db(dbName).collection(collectionName);
}

function normalizeBody(req) {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (_) {
      return {};
    }
  }

  return req.body;
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = normalizeBody(req);
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const businessType = String(body.businessType || body.business || "").trim();
    const sourcePage = String(body.sourcePage || "").trim() || "/";

    if (!name || !email || !businessType) {
      return res.status(400).json({ error: "Name, email, and business type are required." });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const collection = await getCollection();
    const existingEntry = await collection.findOne({ email });

    if (existingEntry) {
      return res.status(409).json({ error: "This email is already on the waitlist." });
    }

    const now = new Date();
    await collection.insertOne({
      name,
      email,
      businessType,
      sourcePage,
      createdAt: now,
      updatedAt: now,
      status: "pending"
    });

    return res.status(201).json({ ok: true, message: "You have been added to the waitlist." });
  } catch (error) {
    console.error("Waitlist submission failed", error);
    return res.status(500).json({ error: "We could not save your details right now. Please try again." });
  }
};
