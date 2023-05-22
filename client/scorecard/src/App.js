import React, { useRef, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";


// const { MongoClient, ServerApiVersion } = require('mongodb');



// const images = require.context('../static', true, /\.jpg$/);
// const imagePaths = images.keys().map(key => "../static" + key.slice(1));


// console.log(statsObj);
// console.log(playerObj);


import { Route, Routes } from "react-router-dom";

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
  
  const player_info = ['firstname','lastname','age','nationality','height','weight','injured'];
  const player_info_list = [];
  let profile_pic = null

  // console.log(player.photo === "-");

  player.photo === "-" ? profile_pic = "../static/images/noplayer.png":profile_pic = player.photo;
  
  player_info.forEach((info_piece) => {   
    player_info_list.push(<InfoRow info ={info_piece} player = {player}/>)
  })

 


  return(
    <section id='playerInfoTable' className='mb-3'>
      <div className='card-custom rounded-4 bg-base shadow-effect mt-5'>
        <div className='playerinfoTable d-block text-center'>
          <div className='card-custom-image d-block text-center mt-5'> <img className='playerAvatar rounded-4 '  src= {profile_pic} alt='player_photo'/></div>
          <h2> Player Profile </h2>
          <table>
            <thead>
              <tr>
                <th className='text-align-center justify-content-center'>Bio</th>
                <th>Info</th>
              </tr>
            </thead>
            <tbody>{player_info_list}</tbody>
          </table>
            
          
        </div>
      </div>
    </section>
  )
}

function PlayerStatTable({stats}){
  
  const stat_info = new Map();
  stat_info.set('team',['name'])
  stat_info.set('league',['name'])
  //if(statistics.games.position == 'Attacker') display the goal and assists stat else display the defending stats
  
  stat_info.set('games',['captain','appearences','minutes','position','rating'])
  
  if(stats.games.position === "Attacker" || stats.games.position === "Midfielder"){
    stat_info.set('goals',['total','assists'])
  }

  else{
    stat_info.set('tackles',['blocks','interceptions']);
  }

  const stat_info_list = []
  
  for(let [key,values] of stat_info.entries()){
    for(let value of values){
      stat_info_list.push(<StatRow statkey = {key} stat = {value} stats={stats}/>);
    }
  }
  return(
    <section id='playerStatTable'>
      <div className='card-custom rounded-4 bg-base shadow-effect mt-5'>
        <div className='playerstatTable d-block text-center'>
          <h2>2022 - 2023 Statistics</h2>
            <table>
              <thead>
                <th>Stat</th>
                <th>Stat Info</th>
              </thead>
              <tbody>{stat_info_list}</tbody>
            </table>
            
          
        </div>
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

function DropdownRow({playerObj,statObj,responseObj,onResponseClick}){
  
  if (!statObj.games.rating) {
    statObj.games.rating = "unrated";
  } else if (!isNaN(Number(statObj.games.rating))) {
    statObj.games.rating = parseFloat(statObj.games.rating).toFixed(2);
  }
  // !statObj.goals.total ? statObj.goals.total = 0:statObj.goals.total = statObj.goals.total;
  // !statObj.tackles.blocks ? statObj.tackles.blocks = 0:statObj.tackles.blocks = statObj.tackles.blocks;
  // !statObj.tackles.interceptions ? statObj.tackles.interceptions = 0:statObj.tackles.interceptions = statObj.tackles.interceptions;

  const player_info_dict = ["age","height","weight"];

  for(const i of player_info_dict){
    if(!playerObj[i]){
      playerObj[i] = "undefined";
    }
  }

  const stat_info = new Map();

  stat_info.set('games',['appearences','minutes'])
  
  if(statObj.games.position === "Attacker" || statObj.games.position === "Midfielder"){
    stat_info.set('goals',['total','assists'])
  }

  else{
    stat_info.set('tackles',['blocks','interceptions']);
  }

  for(let [key,values] of stat_info.entries()){
    for(const value of values){
      if(!statObj[key][value]){
        statObj[key][value] = 0;
      }
    }
  }

  return(
    <tr className='dropdownRow rounded-4'><button className ="shadow-effect rounded-4" onClick={() => onResponseClick(responseObj)}> <td><img  src={playerObj.photo} className='teamLogo rounded-circle' alt='dropdownimage' /></td> <td>{statObj.games.rating}</td> <td>{playerObj.firstname}</td> <td>{playerObj.lastname}</td></button></tr>
  );
}


function DropDown({searchText,onResponseChange}){
  const [queriedPlayers,setQueriedPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`http://localhost:5050/player/${searchText}`);
        if (response.ok) {
          const data = await response.json();
          // console.log(data);
          setQueriedPlayers(data);
        } else {
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (searchText) {
      fetchPlayers();
    } else {
      navigate("/");
      setQueriedPlayers([]);
    }
  }, [searchText]);

  


  let player_row = [];

  if(queriedPlayers.length === 0){
    player_row.push(<tr> <td>No Results Found!</td> </tr>)
  }

  else{
    const maxResults = Math.min(queriedPlayers.length, 3);

    for (let i = 0; i < maxResults; i++) {
      player_row.push(<DropdownRow playerObj={queriedPlayers[i].player} statObj={queriedPlayers[i].statistics[0]} responseObj={queriedPlayers[i]} onResponseClick={onResponseChange} />);
    }
  }

  return(
    <div className='dropdown'>
      <table>
        <thead>
          <th className='dropdown-heading d-flex justify-content-center'>Search Results</th>
        </thead>
        <tbody>{player_row}</tbody>
      </table>
    </div>
    
  );

  
}

function SearchBar(){

  const navigate = useNavigate();
  const [searchText,setsearchText] = useState('');
  const [responseObj,setResponseObj] = useState({
    "player": {
      "id": 276,
      "name": "-",
      "firstname": "-",
      "lastname": "-",
      "age": "-",
      "birth": {
        "date": "-",
        "place": "-",
        "country": "-"
      },
      "nationality": "-",
      "height": "-",
      "weight": "-",
      "injured": false,
      "photo": false
    },
    "statistics": [
      {
        "team": {
          "id": "-",
          "name": "-",
          "logo": "-"
        },
        "league": {
          "id": "-",
          "name": "-",
          "country": "-",
          "logo": "-",
          "flag": "-",
          "season": "-"
        },
        "games": {
          "appearences": "-",
          "lineups": 15,
          "minutes": "-",
          "number": null,
          "position": "-",
          "rating": "-",
          "captain": false
        },
        "substitutes": {
          "in": 0,
          "out": 3,
          "bench": 0
        },
        "shots": {
          "total": "-",
          "on": "-"
        },
        "goals": {
          "total": "-",
          "conceded": null,
          "assists": "-",
          "saves": "-"
        },
        "passes": {
          "total": "-",
          "key": "-",
          "accuracy": "-"
        },
        "tackles": {
          "total": "-",
          "blocks": 0,
          "interceptions": "-"
        },
        "duels": {
          "total": "-",
          "won": "-"
        },
        "dribbles": {
          "attempts": "-",
          "success": "-",
          "past": "-"
        },
        "fouls": {
          "drawn": "-",
          "committed": "-"
        },
        "cards": {
          "yellow": "-",
          "yellowred": "-",
          "red": 0
        },
        "penalty": {
          "won": "-",
          "commited": null,
          "scored": "-",
          "missed": "-",
          "saved": null
        }
      }
    ]
  }
  );


  function handleSearchChange(search_input){
    setsearchText(search_input);
    navigate("/:lastname");
  };


  function handleResponseChange(givenResponse){
    return setResponseObj( (prev) => {
      return {...prev, ...givenResponse};
    });
  }

  return(
    <>
      <section id = "search" className='d-flex flex-column justify-content-center align-items-center'>
        <div>
          <form className= "form-search d-flex justify-content-center align-items-center ">
              <input className='searchBar  rounded-pill mt-3 mb-3 ' value={searchText} onChange={(e) => handleSearchChange(e.target.value)}  placeholder='Search Player...' type='text'/>

          
          </form>
        </div>

        <Routes>
          <Route path="/:lastname" element= {<DropDown searchText={searchText} onResponseChange={handleResponseChange} />} />
        </Routes>
      </section>

      <StatTable player={responseObj.player} stats={responseObj.statistics[0]}/>
      
    </>
    
  )
}

function NavBar(){
  // const [scrollPosition,setScrollPosition] = useState(0);
  // const [showSearchBar, setShowSearchBar] = useState(false);


  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrollPosition(window.scrollY);
  //   };

  //   window.addEventListener("scroll",handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll",handleScroll);
  //   };

  // },[]);

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

            {/* {showSearchBar && (
            <SearchBar/>
          )} */}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default function ScoreCard(){

  

// console.log(responseObj.player);
// console.log(responseObj.statistics);



  return(
    <div className='scoreCard'>
      <NavBar/>
      <SearchBar />

    </div>
  )
}

// Need to take only the necessary info from response

// response.player




// const STATS = JSON.parse(statisticsString);
