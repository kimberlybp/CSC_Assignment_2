function talentDetails(con) {
    function postTalentDetails(req, res) {
        if (req.body.FirstName && req.body.LastName) {
            console.log('Request received');
            con.connect(function (err) {
                var desc = req.body.Description ? req.body.Description : null;
                var gender = req.body.Gender ? req.body.Gender : null;
                var age = req.body.Age ? req.body.Age : null;
                var profilePic = req.body.ProfilePic ? req.body.ProfilePic : null;
                con.query(
                    `INSERT INTO main.Talents (FirstName, LastName, Description, Gender, Age, ProfilePic) VALUES ('${req.body.FirstName}', '${req.body.LastName}', '${desc}', '${gender}', '${age}', '${profilePic}')`,
                    function (err, result, fields) {
                        if (err) res.status(500).json({ code: 500, err });
                        if (result) res.status(200).json({ code: 200, result });
                        if (fields) console.log(fields);
                    },
                );
            });
        } else {
            console.log('Missing a parameter');
        }
    }

    function searchTalentByFirstName(req, res) {
        let input = req.body.query;
        let array = [];
        if (input) {
            let query = input ? input : null;
            let statement = `SELECT * FROM main.Talents WHERE FirstName LIKE '%${query}%';`;
            con.query(statement, (err, results) => {
                if (err) res.status(500).json({ code: 500, err });
                else {
                    Object.values(results).forEach((val) => {
                        array.push(val);
                    });
                    if (array.length > 0) res.status(200).json({ code: 200, array });
                    else res.status(200).json({ code: 200, message: 'No record(s) available.' });
                }
            });
        } else res.status(404).send('Please provide a query string.');
    }

    return {
        post: postTalentDetails,
        search: searchTalentByFirstName,
    };
}

// function createDateTimeString(timestamp) {
//     var date = new Date(timestamp * 1000);
//     var datetimeString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
//     return datetimeString;
// }

module.exports = talentDetails;
