const axios = require('axios');
const mysql = require('mysql');

var con = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'toor',
    database: 'razrabotka'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

sports = ['soccer_uefa_europa_league','soccer_uefa_euro_qualification','soccer_uefa_champs_league','icehockey_sweden_hockey_league','icehockey_nhl','basketball_nba','americanfootball_nfl'];

//https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?regions=us&apiKey=YOUR_API_KEY
//87d26f4d65bad7109668c0cadf6b456b

for(let i = 0; i < 7; i++)
{
    console.log(sports[i]);
axios.get(`https://api.the-odds-api.com/v4/sports/${sports[i]}/odds/?apiKey=87d26f4d65bad7109668c0cadf6b456b&regions=eu&markets=h2h`)
.then(response => {

    for( const val of response.data.values()){
       for(const vall of  val["bookmakers"].values())
       {
        if(vall["key"] == "onexbet")
        {
            console.log(vall["markets"][0]["outcomes"]);

            if(vall["markets"][0]["outcomes"].length == 2) //two outcome matches
            {
              console.log("kur");
              con.query( "INSERT INTO OddsTable ( HomeTeam, AwayTeam, Market, HomeTeamOdds, AwayTeamOdds, DrawOdds) VALUES('" + vall["markets"][0]["outcomes"][0]["name"] + "', '" + vall["markets"][0]["outcomes"][1]["name"] + "', 'h2h'," + vall["markets"][0]["outcomes"][0]["price"] + ","  +vall["markets"][0]["outcomes"][1]["price"]+ ", NULL)",function(err, result, fields) {

                if (err) throw err;
                console.log("Data inserted");

              });
              
            }else // three outcome matches  
            {
              con.query( "INSERT INTO OddsTable ( HomeTeam, AwayTeam, Market, HomeTeamOdds, AwayTeamOdds, DrawOdds) VALUES('" + vall["markets"][0]["outcomes"][0]["name"] + "', '" + vall["markets"][0]["outcomes"][1]["name"] + "', 'h2h'," + vall["markets"][0]["outcomes"][0]["price"] + ","  +vall["markets"][0]["outcomes"][1]["price"]+ ", " +vall["markets"][0]["outcomes"][2]["price"] + ")",function(err, result, fields) {

                if (err) throw err;   
                console.log("Data inserted");
                
              });
              

            }
        }
       }
    }  
  })
  .catch(error => {
    console.error('Error making API request:', error.message);
  });
}
