const joiValidation = require('../joiValidation/talentDetailsValidation');

function talentDetails(con){

    function getAllTalentDetails(req, res){
        con.connect(function (err) {
            con.query(`select * from main.Talents`, function (err, result, fields) {

                if (err) res.status(500).json({ code: 500, err });
                if (result) res.status(200).json({ code: 200, result });
                if (fields) console.log(fields);
            });
        });
    }

    function getTalentDetailsById(req, res){

        const { error, value } = joiValidation.talentIdSchema.validate(req.query);

        if (!error) {

            con.connect(function (err) {
                con.query(`select * from main.Talents where TalentId = ${req.query.TalentId}`, function (err, result, fields) {
                    if (err) res.status(500).json({ code: 500, err });
                    if (result) res.status(200).json({ code: 200, result });
                    if (fields) console.log(fields);
                });
            });
        } else {
            res.status(400).json({ code: 400, message: error });
        }
    }


    function postTalentDetails(req, res) {

        const { error, value } = joiValidation.talentDataSchema.validate(req.body);

        if (!error) {
            console.log('Request received');
            con.connect(function (err) {
                var desc = req.body.Description ? req.body.Description : null;
                var gender = req.body.Gender ? req.body.Gender : null;
                var age = req.body.Age ? req.body.Age : null;
                var interest = req.body.Interest ? req.body.Interest : null;
                var profilePic = req.body.ProfilePic ? req.body.ProfilePic : null;
                con.query(`INSERT INTO main.Talents (FirstName, LastName, Description, Gender, Age, Interest, ProfilePic) VALUES ('${req.body.FirstName}', '${req.body.LastName}', '${desc}', '${gender}', ${age}, '${interest}', '${profilePic}')`, function (err, result, fields) {


                    if (err) res.status(500).json({ code: 500, err });
                    if (result) res.status(200).json({ code: 200, result });
                    if (fields) console.log(fields);
                });
            });
        } else {
            res.status(400).json({ code: 400, message: error });
        }

    }

    function putTalentDetails(req, res) {

        let talentObject = Object.assign({}, req.body, req.query);

        const { error, value } = joiValidation.talentAllSchema.validate(talentObject);

        if (!error) {
            console.log('Request received');
            con.connect(function (err) {
                var desc = req.body.Description ? req.body.Description : null;
                var gender = req.body.Gender ? req.body.Gender : null;
                var age = req.body.Age ? req.body.Age : null;
                var interest = req.body.Interest ? req.body.Interest : null;
                var profilePic = req.body.ProfilePic ? req.body.ProfilePic : null;
                con.query(`UPDATE main.Talents SET FirstName = '${req.body.FirstName}', LastName = '${req.body.LastName}', Description = '${desc}', Gender = '${gender}', Age = ${age}, Interest ='${interest}', ProfilePic ='${profilePic}' where TalentId = ${req.query.TalentId}`, function (err, result, fields) {


                    if (err) res.status(500).json({ code: 500, err });
                    if (result) res.status(200).json({ code: 200, result });
                    if (fields) console.log(fields);
                });
            });
        } else {
            res.status(400).json({ code: 400, message: error });
        }

    }

    function deleteTalentDetailsById(req, res){

        const { error, value } = joiValidation.talentIdSchema.validate(req.query);

        if (!error) {

            con.connect(function (err) {
                con.query(`DELETE FROM main.Talents where TalentId = ${req.query.TalentId}`, function (err, result, fields) {

                    if (err) res.status(500).json({ code: 500, err });
                    if (result) res.status(200).json({ code: 200, result });
                    if (fields) console.log(fields);
                });
            });
        } else {
            res.status(400).json({ code: 400, message: error });
        }
    }


    return{
        getAll: getAllTalentDetails,
        getById: getTalentDetailsById,
        post : postTalentDetails,
        put: putTalentDetails,
        delete: deleteTalentDetailsById

    }

}

module.exports = talentDetails