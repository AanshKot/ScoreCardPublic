

const { MongoClient, ServerApiVersion } = require('mongodb');
const openFootballAPI = require('../openFootballAPI');
const callApi = openFootballAPI.callApi;
const playersData = openFootballAPI.playersData;

const uri = "mongodb+srv://aanshkotian:TimeMachine1@cluster0.lgf6mxr.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const dbName = 'PlayerDB'; // Name of the database
const collectionName = 'Players'; // Name of the collection


// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });


async function addPlayerData(playerData) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect(); // Connect to the MongoDB server
    const db = client.db(dbName); // Get the reference to the database
    const collection = db.collection(collectionName); // Get the reference to the collection

    const result = await collection.insertOne(playerData); // Insert the playerData document into the collection

    console.log('Player data added:', result.insertedId);
  } finally {
    await client.close(); // Close the connection
  }
}

async function fetchData() {
  try {
    // Get all the teams from this competition
    const teams = await callApi('teams', { league: 61, season: 2022 });
    console.log(teams); // Display the teams data if necessary

    // Get all the players from this competition
    const players = await playersData(61, 2022);
    

    // Access and view the contents of the players array
    for (const playerData of players) {
      await addPlayerData(playerData)
      // You can access individual properties of each player object like player.id, player.name, etc.
    }
  } catch (error) {
    console.error(error);
  }
}

fetchData();
