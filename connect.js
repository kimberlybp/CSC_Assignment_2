const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'csc-assignment2-db-instance-1.cgcqfgylzopy.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Pa$$w0rd',
});

con.connect(function (err) {
    if (err) throw err;

    console.log('Connected!');
});

module.exports = con;
