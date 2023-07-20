import db from "../db/conn.mjs";



const API_KEY = process.env.OPEN_API_KEY;
// const uri = process.env.ATLAS_URI;
const collectionName = "Players";


function callApi(endpoint, params = {}) {
    const parameters = new URLSearchParams(params).toString();
    const url = `https://v3.football.api-sports.io/${endpoint}${parameters !== '' ? '?' + parameters : ''}`;
  
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY
      }
    };
  
    return fetch(url, options)
      .then(response => response.json())
      .catch(error => console.error('API request failed:', error));
  }
  


async function updatePlayersCollection() {
  
  
    try {

      const collection = db.collection(collectionName); // Get the reference to the collection
  
    
  
      // Call the OpenFootballAPI to fetch players data for each league
      const leagues = [39, 140, 78, 135, 61]; // IDs of the top 5 leagues
      const season = 2022;
  
      for (const league of leagues) {
        console.log(`Currently updating league ${league}`);
        await updatePlayerData(league, season);
      }
    } finally {
        console.log("Refreshed Database");
    }
  }
  


// Schedule the script to run every three days at 1 pm
// cron.schedule('0 13 */3 * *', async () => {
// await deleteAndRefreshPlayersCollection();
// });