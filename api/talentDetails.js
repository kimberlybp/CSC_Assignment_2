// const mysql = require('mysql');

// const con = mysql.createConnection({
//     host: "csc-assignment2-db-instance-1.cgcqfgylzopy.us-east-1.rds.amazonaws.com",
//     user: "admin",
//     password: "Pa$$w0rd"
// });


function talentDetails(con){


    function postTalentDetails(req, res) {
        if (req.body.FirstName && req.body.LastName) {
            console.log('Request received');
            con.connect(function (err) {
                var desc = req.body.Description ? req.body.Description : null;
                var gender = req.body.Gender ? req.body.Gender : null;
                var age = req.body.Age ? req.body.Age : null;
                var profilePic = req.body.ProfilePic ? req.body.ProfilePic : null;
                con.query(`INSERT INTO main.Talents (FirstName, LastName, Description, Gender, Age, ProfilePic) VALUES ('${req.body.FirstName}', '${req.body.LastName}', '${desc}', '${gender}', '${age}', '${profilePic}')`, function (err, result, fields) {
                    
                    
                    if (err) response.status(500).json({ code: 500, err });
                    if (result) res.status(200).json({ code: 200, result });
                    if (fields) console.log(fields);
                });
            });
        } else {
            console.log('Missing a parameter');
        }

    }


    return{
        post : postTalentDetails

    }

}

module.exports = talentDetails