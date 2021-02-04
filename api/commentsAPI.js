
function comments(con){


    function getAllCommentss(req, res){
        con.connect(function (err) {
            con.query(`select * from main.Comments`, function (err, result, fields) {

                if (err) res.status(500).json({ code: 500, err });
                if (result) res.status(200).json({ code: 200, result });
                // if (fields) console.log(fields);
            });
        });
    }

    function getCommentsById(req, res){

            con.connect(function (err) {
                con.query(`select * from main.Comments where id = ${req.query.id}`, function (err, result, fields) {

                    if (err) res.status(500).json({ code: 500, err });
                    if (result) res.status(200).json({ code: 200, result });
                    // if (fields) console.log(fields);
                });
            });
    }

    function getCommentsByTalentId(req, res){

        con.connect(function (err) {
            con.query(`select * from main.Comments where TalentId = ${req.query.TalentId}`, function (err, result, fields) {
                console.log(err);

                if (err) res.status(500).json({ code: 500, err });
                if (result) res.status(200).json({ code: 200, result });
                // if (fields) console.log(fields);
            });
        });
}


    return{
        getAll: getAllCommentss,
        getById: getCommentsById,
        getByTalentId: getCommentsByTalentId,
        // post : postTalentDetails,
        // put: putTalentDetails,
        // delete: deleteTalentDetailsById

    }

}

module.exports = comments