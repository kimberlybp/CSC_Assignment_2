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

class DbService {
    static getDbServiceInstance() {
        if (!instance) instance = new DbService();
        return instance;
    }

    async postComment(fName, lName, comment) {
        let timestamp = new Date.now();

        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Comments (FirstName, LastName, CreatedAt, Comment) VALUES (?,?,?,?);';

            connection.query(query, [fName, lName, timestamp, comment], (err, result) => {
                if (err) {
                    console.log(err.message);
                    reject(err.message);
                }
                resolve(result);
            });
        });
    }
}

module.exports = con;
module.exports = DbService;
