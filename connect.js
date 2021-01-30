const mysql = require('mysql');

const con = mysql.createConnection({
    host: "csc-assignment2-db-instance-1.cgcqfgylzopy.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "Pa$$w0rd"
});

con.connect(function(err) {
    if (err) throw err;

    console.log("Connected!");


    // con.query('CREATE DATABASE IF NOT EXISTS main;');
    // con.query('USE main;');
    // con.query('CREATE TABLE IF NOT EXISTS users(TalentId int NOT NULL AUTO_INCREMENT,LastName varchar(255) NOT NULL, FirstName varchar(255) NOT NULL, Description LONGTEXT, Gender char(1), Age int, ProfilePic Varchar(50), PRIMARY KEY(TalentId));', function(error, result, fields) {
    //     console.log(error);
    //     console.log(result);
    //     console.log(fields);
    // });
    // con.end();
});

module.exports = con;