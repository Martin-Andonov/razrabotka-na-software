const express = require('express');
const bodyParser = require('body-parser');
const parser = require('body-parser');
const port = 8080;
const app = express();
var whitelist = {};
const mysql = require('mysql');

var con = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'toor',
    database: 'razrabotka'
});
//here the outcome of matches will be determined by rng 
//in real world apication we will need to make request to the oddsApi to give us the result of the match
//the outcome of matches will be calculated when user logs in

function create_account(username, email, password, name,balance, res) {
    con.query("Select CustomerId FROM customer WHERE ScreenName = \'" + String(username) + "\'", function(err, result, fields) {
        if (err) {
            res.status(200).send({
                respons: 'Internal error!'
            })
            throw err;
        }
        if(result.length == 0) 
        {
            con.query("INSERT INTO customer (ScreenName, Password, Email, Name, Balance) VALUES('" + username + "', '" + password + "', '" + email +"', '" + name +  "'," +balance+ ");", function(err, result, fields) {
                if (err) {
                    res.status(200).send({
                        respons: 'Internal error!'
                    })
                    throw err;
                }
                res.status(200).send({
                    respons: "Added successfully"
                })
            });

        }else{
            res.status(200).send({
                respons: 'Username already exists'
            })
        }
    });
}

function log_in(username, password, req, res) {
    con.query("SELECT Password FROM customer WHERE ScreenName = \'" + String(username) + "\';", function(err, result, fields) {

        if (err) {
            res.status(200).send({
                respons: 'Internal error!'
            })
            throw err;
        }
        if (result[0]["Password"] == String(password)) {
            console.log("login succsesgull!");
            res.status(200).send({
                respons: 'Login successful'
            })
            whitelist[req.ip] = username;
        } else {
            res.status(200).send({
                respons: 'Incorect username and password! \n If you dont have account please register first!'
            })
        }
    });
}

function check_balance(username,res)
{
    con.query("SELECT Balance FROM Customer WHERE ScreenName = '" +username+"';", function(err, result, fields) {
        if (err) {
            res.status(200).send({
                respons: 'Internal error!'
            })
            throw err;
        }

        res.status(200).send({
            respons:result[0]
        })
    });
}

function deposit(username, money, res)
{
    con.query("SELECT Balance FROM Customer WHERE ScreenName = '" + username + "';", function(err, result, fields) {
        
        if (err) {
            res.status(200).send({
                respons: 'Internal error!'
            })
            throw err;
        }
        var newBalance = result[0]["Balance"] + money;
        con.query("SELECT CustomerID FROM Customer WHERE ScreenName = '" + username + "';",function(err, result, fields){ 
            
            if (err) {
                res.status(200).send({
                    respons: 'Internal error!'
                })
                throw err;
            }

            con.query("UPDATE Customer SET Balance = " + newBalance +" WHERE CustomerID = '" + result[0]["CustomerID"] +"';", function(err, result, fields) {
                if (err) {
                    res.status(200).send({
                        respons: 'Internal error!'
                   })
                   throw err;
                }

                 res.status(200).send({
                    respons: "Balance update to " + newBalance
                })
            
            });

            
        });
    });
}

function withdraw(username, money, res)
{
    con.query("SELECT Balance FROM Customer WHERE ScreenName = '" + username + "';", function(err, result, fields) {
        
        if (err) {
            res.status(200).send({
                respons: 'Internal error!'
            })
            throw err;
        }
        var newBalance = result[0]["Balance"] - money
        
        if( newBalance >= 0)
        {
            con.query("SELECT CustomerID FROM Customer WHERE ScreenName = '" + username + "';",function(err, result, fields){ 
                
                if (err) {
                    res.status(200).send({
                        respons: 'Internal error!'
                   })
                   throw err;
                }

                con.query("UPDATE Customer SET Balance = " + newBalance +" WHERE CustomerID = '" + result[0]["CustomerID"] +"';", function(err, result, fields) {
                    if (err) {
                        res.status(200).send({
                            respons: 'Internal error!'
                       })
                       throw err;
                    }
    
                     res.status(200).send({
                        respons: "Money withdrawn: " + money + " Balance update to " + newBalance
                    })
                
                });
    
                
            });

        }else{
            res.status(200).send({
                respons:"There aren't enough money in the acount to complete the transaction!"
            })
        }
        
    });
}



function placeBet(username,matchId,team,money,res)
{
    con.query("SELECT CustomerID FROM Customer WHERE ScreenName = '" + username + "';",function(err, result, fields){ 
        
        if (err) {
            res.status(200).send({
                respons: 'Internal error!'
            })
            throw err;
        }
        var customerid = result[0]["CustomerID"];
        con.query("SELECT Balance FROM Customer WHERE CustomerID = '" +customerid + "';", function(err, result, fields) {
        
            if (err) {
                res.status(200).send({
                    respons: 'Internal error!'
                })
                throw err;
            }
            var newBalance = result[0]["Balance"] - money;
            if(newBalance >= 0)
            {
                       
                con.query("SELECT * FROM OddsTable WHERE BetId = " + matchId + ";",function(err, result, fields) {
        
                    if (err) {
                        res.status(200).send({
                            respons: 'Internal error!'
                        })
                        throw err;
                    }
                    
                    if(result.length > 0)
                    {
                       if(team == 0 && result[0]["DrawOdds"] != null)
                       {
                        con.query("INSERT INTO Bets (CustomerID, money, BetStatus, BetResult, Odds) VALUES (" + customerid + "," + money +", 0, NULL," + result[0]["DrawOdds"] + ")",function(err, result, fields) {
        
                            if (err) {
                                res.status(200).send({
                                    respons: 'Internal error!'
                                })
                                throw err;
                            }
                            
                             
                            res.status(200).send({
                                respons:"Successfully placed a bet!"
                            })
                        });

                       }else if(team == 1)
                       {
                        con.query("INSERT INTO Bets (CustomerID, money, BetStatus, BetResult, Odds) VALUES (" + customerid + "," + money +", 0, NULL," + result[0]["HomeTeamOdds"] + ")",function(err, result, fields) {
        
                            if (err) {
                                res.status(200).send({
                                    respons: 'Internal error!'
                                })
                                throw err;
                            }

                            con.query("UPDATE Customer SET Balance = " + newBalance +" WHERE CustomerID = '" + customerid +"';", function(err, result, fields) {
                                if (err) {
                                    res.status(200).send({
                                        respons: 'Internal error!'
                                   })
                                   throw err;
                                }
                
                                con.query("UPDATE Customer SET Balance = " + newBalance +" WHERE CustomerID = '" + customerid +"';", function(err, result, fields) {
                                    if (err) {
                                        res.status(200).send({
                                            respons: 'Internal error!'
                                       })
                                       throw err;
                                    }
                    
                                    res.status(200).send({
                                        respons:"Successfully placed a bet!"
                                    })
                                });
                                
                            });
                        });

                       }else if(team == 2)
                       {
                        con.query("INSERT INTO Bets (CustomerID, money, BetStatus, BetResult, Odds) VALUES (" + customerid + "," + money +", 0, NULL," + result[0]["AwayTeamOdds"] + ")",function(err, result, fields) {
        
                            if (err) {
                                res.status(200).send({
                                    respons: 'Internal error!'
                                })
                                throw err;
                            }

                            con.query("UPDATE Customer SET Balance = " + newBalance +" WHERE CustomerID = '" + customerid +"';", function(err, result, fields) {
                                if (err) {
                                    res.status(200).send({
                                        respons: 'Internal error!'
                                   })
                                   throw err;
                                }
                
                                res.status(200).send({
                                    respons:"Successfully placed a bet!"
                                })
                            });
                        });
                       
                       }else{
                        res.status(200).send({
                            respons:"Invalid team to bet on!"
                        })
                       }

                    }else{
                        res.status(200).send({
                            respons:"There is no match with that id!"
                        })
                    }
                });

            }else{
                res.status(200).send({
                    respons:"There aren't enough money in the acount to complete the transaction!"
                })
            }
        }); 
    });
}

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.listen(
    port,
    () => console.log("SERVER ALLIVE!!")
)

app.use(parser.json());


app.get('/', (req, res) => {
    
    
    if (req.body["command"] == "login") 
    {

        if (!whitelist.hasOwnProperty(req.ip)) 
        {
            log_in(req.body["username"], req.body["password"], req, res);
        } else 
        {
            res.status(200).send({
                respons: 'You are already logged in!'
            })
        }

    } else if (req.body["command"] == "signin") 
    {
        create_account(req.body["username"],req.body["email"],req.body["password"],req.body["name"],req.body["balance"],res);

    } else if (req.body["command"] == "checkBalance") 
    {
        if (whitelist.hasOwnProperty(req.ip)) 
        {
            check_balance(whitelist[req.ip],res)
        } else 
        {
            res.status(200).send({
                respons: "You need to login to check balance!"
            })
        }
    } else if (req.body["command"] == "placeBet") 
    {

        if (whitelist.hasOwnProperty(req.ip)) 
        {
            placeBet(whitelist[req.ip],req.body["matchId"],req.body["team"],req.body["money"],res);
        } else 
        {
            res.status(200).send({
                respons: "You need to login to place a bet!"
            })
        }
    } else if(req.body["command"] == "deposit")
    {
        if (whitelist.hasOwnProperty(req.ip)) 
        {
           deposit(whitelist[req.ip],req.body["money"],res);
        } else 
        {
            res.status(200).send({
                respons: "You need to login to deposit!"
            })
        }

    }else if(req.body["command"] == "withdraw")
    {
        if (whitelist.hasOwnProperty(req.ip)) 
        {
            withdraw(whitelist[req.ip],req.body["money"],res);
        } else 
        {
            res.status(200).send({
                respons: "You need to login to cashout!"
            })
        }

    }else 
    {
        res.status(200).send({
            respons: "You have incorect command parameter!"
        })
    }


});
