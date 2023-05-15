import React, { useRef, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import fullpage from "fullpage.js";


// const images = require.context('../static', true, /\.jpg$/);
// const imagePaths = images.keys().map(key => "../static" + key.slice(1));

const jsonObj = JSON.parse('{"get":"players","parameters":{"id":"276","season":"2019"},"errors":[],"results":1,"paging":{"current":1,"total":1},"response":[{"player":{"id":276,"name":"Neymar","firstname":"Neymar","lastname":"da Silva Santos Júnior","age":28,"birth":{"date":"1992-02-05","place":"Mogi das Cruzes","country":"Brazil"},"nationality":"Brazil","height":"175 cm","weight":"68 kg","injured":false,"photo":"https://media.api-sports.io/football/players/276.png"},"statistics":[{"team":{"id":85,"name":"Paris Saint Germain","logo":"https://media.api-sports.io/football/teams/85.png"},"league":{"id":61,"name":"Ligue 1","country":"France","logo":"https://media.api-sports.io/football/leagues/61.png","flag":"https://media.api-sports.io/flags/fr.svg","season":2019},"games":{"appearences":15,"lineups":15,"minutes":1322,"number":null,"position":"Attacker","rating":"8.053333","captain":false},"substitutes":{"in":0,"out":3,"bench":0},"shots":{"total":70,"on":36},"goals":{"total":13,"conceded":null,"assists":6,"saves":0},"passes":{"total":704,"key":39,"accuracy":79},"tackles":{"total":13,"blocks":0,"interceptions":4},"duels":{"total":null,"won":null},"dribbles":{"attempts":143,"success":88,"past":null},"fouls":{"drawn":62,"committed":14},"cards":{"yellow":3,"yellowred":1,"red":0},"penalty":{"won":1,"commited":null,"scored":4,"missed":1,"saved":null}}]}]}');

const playerObj = jsonObj.response[0].player;
const statsObj = jsonObj.response[0].statistics[0];

// console.log(statsObj);
// console.log(playerObj);

function StatRow({statkey,stat,stats}){
  
  let input_stat = null;
  let team_logo = null;
  let league_name = null;

  if(stat === "captain"){
    if(stats[statkey][stat] === true){
      input_stat = <span style={{color: "green"}}> Yes</span>
    }
    else{
      input_stat = <span style={{color: "red"}}>No</span>
    }
  }

  else{
    input_stat = stats[statkey][stat];
  }

  stat === "name"?  team_logo = <img className = "teamLogo" src={stats[statkey]["logo"]} alt='team-logo'/>:team_logo = null; 
  stat === "total"? stat = "goals": stat = stat; 
  
 

  if(statkey === "league" || statkey === "team" && stat === "name") {
    return(<tr className='playerStat'>
      <td>{statkey}</td>
      <td>{stats[statkey][stat]}</td> 
      <td>{team_logo}</td> 
    </tr>)
    }

  
  return(
    <tr className='playerStat' key={statkey} > 
      <td>{league_name} <span>{stat}</span> </td>
      <td>{input_stat}</td> 
      <td>{team_logo}</td>
    </tr>
  )

}

function InfoRow({info,player}){
  const top_9 = ["argentina","brazil","england","france","germany","italy","netherlands","portugal","spain"];
  let input_info = null;
  let player_flag = null;
  let player_flag_img = null;

  if(info === "injured"){
    if(player[info] === true){
      input_info = <span style={{color: 'red'}}>Yes</span>
    }
    else{
      input_info = <span style={{color: "green"}}>No</span>
    }
  }
  else{
    input_info = player[info];
  }

  info === "firstname"? info = "first name": info = info;
  info === "lastname"? info = "last name": info = info;
  
 

  if(top_9.indexOf(player.nationality.toLowerCase()) !== -1){
    player_flag = require(`../static/images/${player.nationality.toLowerCase()}.png`);
  }
  
  
  if (info === "nationality" && player_flag !== null) {
    // create an image element with the player's nationality flag
  
    player_flag_img = <img className = 'teamLogo' src = {player_flag} alt='nationality_flag'/>
    return(<tr className='playerInfo'> 
    <td>{info}</td>
    <td>{input_info}</td> 
    <td>{player_flag_img}</td>
    </tr>);
  }

  return(
    <tr className='playerInfo' key={info}> 
      <td><span>{info}</span> </td> 
      <td>{input_info}</td>
      <td></td>
    </tr>
  )
}

function PlayerInfoTable({player}){
  const player_info = ['firstname','lastname','age','nationality','injured'];
  const player_info_list = [];
  let profile_pic = null
  !player.photo || player.photo.length === 0 ? profile_pic = "../static/images/noplayer.png":profile_pic = player.photo
  
  player_info.forEach((info_piece) => {   
    player_info_list.push(<InfoRow info ={info_piece} player = {player}/>)
  })

 


  return(
    <section id='playerInfoTable' className='mb-3'>
      <div className='profilePic d-block text-center mt-5'> <img className='playerAvatar rounded-circle '  src= {profile_pic} alt='player_photo'/></div>
      <div className='playerinfoTable d-block text-center mt-3'>
        <h2> Player Profile </h2>
        <table>
          <thead>
            <tr>
              <th className='text-align center'>Bio</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>{player_info_list}</tbody>
        </table>
          
        
      </div>
    </section>
  )
}

function PlayerStatTable({stats}){
  
  const stat_info = new Map();
  stat_info.set('team',['name'])
  stat_info.set('league',['name'])
  //if(statistics.games.position == 'Attacker') display the goal and assists stat else display the defending stats
  stat_info.set('games',['appearences','minutes','position','rating','captain'])
  stat_info.set('goals',['total','assists'])
  const stat_info_list = []
  let season_next = parseInt(stats["league"]["season"]) + 1;
  for(let [key,values] of stat_info.entries()){
    for(let value of values){
      stat_info_list.push(<StatRow statkey = {key} stat = {value} stats={stats}/>);
    }
  }
  return(
    <section id='playerStatTable'>
      <div className='playerstatTable d-block text-center'>
        <h2>2023 - 2024 Statistics</h2>
          <table>
            <thead>
            </thead>
            <tbody>{stat_info_list}</tbody>
          </table>
          
        
      </div>
    </section>
  )
}


function StatTable({player,stats}){
  

  
  return(
    <div>
      
      <PlayerInfoTable player = {player}/>
      <PlayerStatTable stats = {stats}/>
    </div>
  )
}

function SearchBar(){
  const [searchText,setsearchText] = useState('');
  return(
      <section id = "search" className='d-flex flex-column justify-content-center align-items-center' >
        <div>
          <form className= "form-search d-flex justify-content-center align-items-center ">
              <input className='searchBar  rounded-pill mt-3 mb-3 '  placeholder='Search Player...' type='text'/>

            {/* inside searchbar there will be a div with a dropdown menu */}
            {/* e.g. <dropDown/> */}
          
          </form>
        </div>
      </section>
    
  )
}

function NavBar(){
  const [scrollPosition,setScrollPosition] = useState(0);
  const [showSearchBar, setShowSearchBar] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll",handleScroll);

    return () => {
      window.removeEventListener("scroll",handleScroll);
    };

  },[]);

    // useEffect(() => {
    //   if (scrollPosition > 500) {
    //     setShowSearchBar(true);
    //   } else {
    //     setShowSearchBar(false);
    //   }
    // }, [scrollPosition]);

  return(
    <div className='mb-5'>
      <nav className='navbar navbar-expand-lg navbar-dark'>
        <div id="navbarNav" className="nav_container container-fluid flex-lg-column">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div id = 'navbarNav'className="navcontainer collapse navbar-collapse">
            <ul className="navbar-nav ms-auto flex-lg-md-sm-row  text-lg-center">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#search">Search Player</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#playerInfoTable">Player Bio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#playerStatTable">Player Season Statistics</a>
              </li>
            </ul>

            {showSearchBar && (
            <SearchBar/>
          )}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default function ScoreCard(){
  


  return(
    <div className='scoreCard'>
      <NavBar/>
      <SearchBar/>
      <StatTable player={playerObj} stats={statsObj}/>
    </div>
  )
}

// Need to take only the necessary info from response

// response.player




// const STATS = JSON.parse(statisticsString);
