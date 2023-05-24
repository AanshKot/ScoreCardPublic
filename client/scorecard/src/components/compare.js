import React, { useRef, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import Chart from 'chart.js/auto'
// import { Chart, Bar } from 'react-chartjs-2'
import { Route, Routes } from "react-router-dom";


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
        navigate("/:compareLastName");
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
  
  function ComparisonChart({ currResponseObj, compareResponseObj }) {
    const canvasRef = useRef(null);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const player1_photo = currResponseObj.player.photo;
      const stat1 = currResponseObj.statistics[0];
  
      const player2_photo = compareResponseObj.player.photo;
      const stat2 = compareResponseObj.statistics[0];
  
      let error_msg = "";
  
      if (stat1.games.position !== stat2.games.position) {
        error_msg = `Cannot compare ${stat1.games.position} to ${stat2.games.position}`;
        setError(error_msg);
      } else {
        setError(""); // Clear the error if there was one previously
  
        const stat_dict = new Map();
        const graph_labels = [];
  
        stat_dict.set("games", ["appearences"]);
        graph_labels.push("Apps");
        if (stat1.games.position === "Attacker" || stat1.games.position === "Midfielder") {
          stat_dict.set("goals", ["total", "assists"]);
          // dribble success rate success/attempts
          stat_dict.set("dribbles", ["attempts", "success"]);
  
          stat_dict.set("passes", ["key", "accuracy"]);
            
          
          graph_labels.push("Goals (Total)");
          graph_labels.push("Assists");
        //   graph_labels.push("Goals per Apps");
        //   graph_labels.push("Assists per Apps");
          graph_labels.push("Dribbles (Attempts)");
          graph_labels.push("Successful Dribbles");
          graph_labels.push("Passes (Key)");
          graph_labels.push("Pass Accuracy (%)");
        } else {
          stat_dict.set("tackles", ["blocks", "interceptions"]);
          stat_dict.set("duels", ["total", "won"]);
          stat_dict.set("fouls", ["drawn", "committed"]);
  
          graph_labels.push("Tackles (Blocks)");
          graph_labels.push("Interceptions");
        //   graph_labels.push("Blocks per Appearence");
        //   graph_labels.push("Interceptions per Appearence");
          graph_labels.push("Duels (Total)");
          graph_labels.push("Duels Won");
          graph_labels.push("Fouls Drawn");
          graph_labels.push("Fouls Committed");
        }
  
        const curr_player_data = [];
        const compare_player_data = [];
  
        for (let [key, values] of stat_dict.entries()) {
          for (let val of values) {
            curr_player_data.push(stat1[key][val]);
            compare_player_data.push(stat2[key][val]);
          }
        }
        
        // if(stat1.games.position === "Attacker" || stat1.games.position === "Midfielder" ){
        //     curr_player_data.splice(2, 0, stat1["goals"]["total"] / stat1["games"]["appearences"], stat1["goals"]["assists"] / stat1["games"]["appearences"]);
        //     compare_player_data.splice(2, 0, stat2["goals"]["total"] / stat2["games"]["appearences"], stat2["goals"]["assists"] / stat2["games"]["appearences"]);
        // }

        const ctx = canvasRef.current;
  
        if (ctx) {
          if (ctx.chart) {
            ctx.chart.destroy();
          }
  
          ctx.chart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: graph_labels,
              datasets: [
                {
                  label: `${currResponseObj.player.lastname}`,
                  data: curr_player_data,
                  backgroundColor: 'rgba(128, 0, 0, 0.6)',
                },
                {
                  label: `${compareResponseObj.player.lastname}`,
                  data: compare_player_data,
                  backgroundColor: 'rgba(0, 128, 128,  0.6)',
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  ticks:{
                    stepSize: 5,
                  },
                },
              },
              plugins: {
                chartArea: {
                    backgroundColor: 'white',
                }
            },
            },

          });
        }
      }
    }, [currResponseObj, compareResponseObj]);
  
    return (
      <div className="compareChart">
        {error ? (
          <div>{error}</div>
        ) : (
          <canvas id="playerStatChart" ref={canvasRef} style={{width: '350px', height: '400px'}}></canvas>
        )}
      </div>
    );
  }
  

export default function CompareTable({currResponseObj}){
    const navigate = useNavigate();
    const [searchText,setsearchText] = useState('');

 
    
    const [compareResponseObj,setCompareResponseObj] = useState({
      "player": {
        "id": 275,
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
            "appearences": 0,
            "lineups": 15,
            "minutes": "-",
            "number": null, 
            "position": currResponseObj.statistics[0].games.position, // Update position from currResponseObj
            "rating": "-",
            "captain": false
          },
          "substitutes": {
            "in": 0,
            "out": 3,
            "bench": 0
          },
          "shots": {
            "total": 0,
            "on": 0
          },
          "goals": {
            "total": 0,
            "conceded": null,
            "assists": 0,
            "saves": 0
          },
          "passes": {
            "total": 0,
            "key": 0,
            "accuracy": 0
          },
          "tackles": {
            "total": 0,
            "blocks": 0,
            "interceptions": 0
          },
          "duels": {
            "total": 0,
            "won": 0
          },
          "dribbles": {
            "attempts": 0,
            "success": 0,
            "past": 0
          },
          "fouls": {
            "drawn": 0,
            "committed": 0
          },
          "cards": {
            "yellow": 0,
            "yellowred": 0,
            "red": 0
          },
          "penalty": {
            "won": 0,
            "commited": null,
            "scored": 0,
            "missed": 0,
            "saved": null
          }
        }
      ]
    });
  

    
  
    function handleSearchChange(search_input){
      setsearchText(search_input);
      navigate("/:compareLastName");
    };
  
  
    function handleResponseChange(givenResponse){
      return setCompareResponseObj( (prev) => {
        return {...prev, ...givenResponse};
      });
    }
  
    return(
      <>
        <section id = "compareTable" className='compareTable d-flex flex-column justify-content-center align-items-center'>
         
         <div>
          <div className='compareChart'>
                <form className= "form-search d-flex justify-content-center align-items-center ">
                    <input className='searchBar  rounded-pill mt-3 mb-3 ' value={searchText} onChange={(e) => handleSearchChange(e.target.value)}  placeholder='Search Player to compare to...' type='text'/>
    
                
                </form>
            </div>
    
            <Routes>
                {/* create a new route */}
                <Route path="/:compareLastName" element= {<DropDown searchText={searchText} onResponseChange={handleResponseChange} />} />
            </Routes>

                <div className='comparisonChart'>
                    <ComparisonChart currResponseObj = {currResponseObj} compareResponseObj = {compareResponseObj}/>
                </div>
            </div>
        </section>
  
      </>
      
    )
}