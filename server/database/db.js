const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'PlayerDB';

const connectDB = async (playerData) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db(dbName);
    console.log('Connected to MongoDB');

    // Insert the player document with statistics sub-collection
    const playersCollection = db.collection('Players');
    await playersCollection.insertOne(playerData);

    console.log('Player data inserted into MongoDB');

    // Close the MongoDB connection
    client.close();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

module.exports = connectDB;
