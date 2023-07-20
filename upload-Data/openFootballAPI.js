async function callApi(endpoint, params = {}) {
  const parameters = new URLSearchParams(params).toString();
  const url = `https://v3.football.api-sports.io/${endpoint}${parameters !== '' ? '?' + parameters : ''}`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'c178798e06a074c5d6a4c71e141cb8af'
    }
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}

async function playersData(league, season, page = 35, playerDataArray = []) {
  const players = await callApi('players', { league, season, page });
  console.log(players);
  // console.log("Total pages " + players.paging.total);
  // console.log("Current Page " + page);
  playerDataArray = playerDataArray.concat(players.response);

  if (players.paging.current < players.paging.total) {
    const nextPage = players.paging.current + 1;
    if (nextPage % 2 === 1) {
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    playerDataArray = await playersData(league, season, nextPage, playerDataArray);
  }
  return playerDataArray;
}


module.exports = { callApi, playersData };