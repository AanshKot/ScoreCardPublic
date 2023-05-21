// const axios = require('axios');




  function callApi(endpoint, params = {}) {
    const parameters = new URLSearchParams(params).toString();
    const url = `https://v3.football.api-sports.io/${endpoint}${parameters !== '' ? '?' + parameters : ''}`;
  
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'c178798e06a074c5d6a4c71e141cb8af'
      }
    };
  
    return fetch(url, options)
      .then(response => response.json())
      .catch(error => console.error('API request failed:', error));
  }
  
  async function playersData(league, season, page = 1, myPlayersData = []) {
    const players = await callApi('players', { league, season, page });
    myPlayersData.push(...players.response);
  
    if (players.paging.current < players.paging.total) {
      const nextPage = players.paging.current + 1;
      if (nextPage % 2 === 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      return myPlayersData.concat(await playersData(league, season, nextPage, myPlayersData));
    }
    return myPlayersData;
  }
  

  
  module.exports = { callApi, playersData };