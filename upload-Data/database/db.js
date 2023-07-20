

const { MongoClient, ServerApiVersion } = require('mongodb');
const openFootballAPI = require('../openFootballAPI.js');
const playersData = openFootballAPI.playersData;
const callApi = openFootballAPI.callApi;
uri= "mongodb+srv://aanshkotian:TimeMachine1@cluster0.lgf6mxr.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const dbName = 'PlayerDB'; // Name of the database
const collectionName = 'Players'; // Name of the collection




async function resetDatabase(){
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try{
    await  client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.deleteMany({});
  }
  finally{
    console.log("Reset Database");
    await client.close();
  }
}

// resetDatabase();




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
  const leagues = [61]
  for(const league of leagues){
    try {
      // Get all the teams from this competition
      
      // const teams = await callApi('teams', { league: league, season: 2022 });
      
      // console.log(teams);
      // Get all the players from this competition
      const players = await playersData(league, 2022);
      
      // console.log(players.length);

      // for (const player of players){
      //   console.log(player);
      // }

      // Access and view the contents of the players array
      for (const playerData of players) {
        await addPlayerData(playerData)
        // You can access individual properties of each player object like player.id, player.name, etc.
      }
    } catch (error) {
      console.error(error);
    }
  }
}



// fetchData();
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function addTeamPlayers(){
  const team = 85;
  const returned_team = await callApi("players/squads",{team});
  console.log(returned_team);
  const players = returned_team.response[0].players;
  const season = 2022;


  console.log(players);

  for(const player of players){
    console.log(player.id);
    let id = player.id
    await delay(10000); // Introduce a delay of 1 second before each API call
    const player_data = await callApi("players",{id,season});
    console.log(player);
    console.log(player_data);

    await addPlayerData(player_data.response[0]);
  }

}

addTeamPlayers();

async function removeDuplicatePlayers() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  
  try {
    console.log("Connecting to database");
    await client.connect();
    
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const uniqueIds = new Set();
    const cursor = collection.find();

    for await (const response of cursor) {
      if (uniqueIds.has(response.player.id)) {
        // Delete the duplicate player
        await collection.deleteOne({ "player.id": response.player.id });
        console.log(`Deleted duplicate player with ID: ${response.player.id}`);
      } else {
        uniqueIds.add(response.player.id);
      }
    }

    console.log('Duplicates removed successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    client.close();
  }
}

// // Call the function to remove duplicate players
// removeDuplicatePlayers();
