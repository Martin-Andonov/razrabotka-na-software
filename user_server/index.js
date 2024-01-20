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

function create_account(username, email, password, name, res) {

    con.query("Select UserId FROM userstable WHERE UserName = \'" + String(username) + "\'", function(err, result, fields) {
        if (err) {
            res.status(200).send({
                respons: 'Internal error!'
            })
            throw err;
        }
        console.log(result.length)
        if(result.length == 0) 
        {
            con.query("INSERT INTO UsersTable (UserName, HashedPassword, Email, Name) VALUES('" + username + "', '" + password + "', '" + email +"', '" + name + "');", function(err, result, fields) {
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
    con.query("SELECT HashedPassword FROM userstable WHERE UserName = \'" + String(username) + "\';", function(err, result, fields) {

        if (err) {
            res.status(200).send({
                respons: 'Internal error!'
            })
            throw err;
        }
        if (result[0]["HashedPassword"] == String(password)) {
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
    console.log(req.body["command"])
});


