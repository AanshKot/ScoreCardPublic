import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);
const dbName = 'PlayerDB'; // Name of the database



let conn;
try {
  conn = await client.connect();
  console.log("Successfully connected to MongoDB Atlas");
} catch(e) {
  console.error(e);
}

let db = conn.db(dbName);

export default db;