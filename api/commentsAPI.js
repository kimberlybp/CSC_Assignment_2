const joiValidation = require('../joiValidation/commentsValidation');

function comments(con) {


    function getAllCommentss(req, res) {
        con.connect(function (err) {
            con.query(`select * from main.Comments`, function (err, result, fields) {

                if (err) res.status(500).json({ code: 500, err });
                if (result) res.status(200).json({ code: 200, result });
                // if (fields) console.log(fields);
            });
        });
    }

    function getCommentsById(req, res) {

        const { error, value } = joiValidation.commentIdSchema.validate(req.body);

        if (!error) {
            con.connect(function (err) {
                con.query(`select * from main.Comments where CommentId = ${req.query.CommentId}`, function (err, result, fields) {

                    if (err) res.status(500).json({ code: 500, err });
                    if (result) res.status(200).json({ code: 200, result });
                    // if (fields) console.log(fields);
                });
            });


        } else {
            res.status(400).json({ code: 400, message: error });
        }
    }

    function getCommentsByTalentId(req, res) {

        const { error, value } = joiValidation.talentIdSchema.validate(req.body);

        if (!error) {
            con.connect(function (err) {
                con.query(`select * from main.Comments where TalentId = ${req.query.TalentId}`, function (err, result, fields) {
                    console.log(err);

                    if (err) res.status(500).json({ code: 500, err });
                    if (result) res.status(200).json({ code: 200, result });
                    // if (fields) console.log(fields);
                });
            });


        } else {
            res.status(400).json({ code: 400, message: error });
        }
    }


    function postComments(req, res) {

        const { error, value } = joiValidation.commentDataSchema.validate(req.body);

        if (!error) {
            console.log('Request received');
            con.connect(function (err) {
                var talentId = data.TalentId;
                var firstName = data.FirstName;
                var lastName = data.LastName;
                var createdat = data.CreatedAt;
                var comment = data.Comment;

                con.query(`Insert into main.Comments (TalentId, FirstName, LastName, CreatedAt, Comment) VALUES (${talentId},'${firstName}', '${lastName}', '${createdat}', '${comment}')`, function (err, result, fields) {


                    if (err) res.status(500).json({ code: 500, err });
                    if (result) res.status(200).json({ code: 200, result });
                    if (fields) console.log(fields);
                });
            });
        } else {
            res.status(400).json({ code: 400, message: error });
        }

    }


    function putComments(req, res) {

        let commentObject = Object.assign({}, req.body, req.query);

        const { error, value } = joiValidation.commentAllSchema.validate(commentObject);

        if (!error) {
            console.log('Request received');
            con.connect(function (err) {
                var talentId = commentObject.TalentId;
                var firstName = commentObject.FirstName;
                var lastName = commentObject.LastName;
                var createdat = commentObject.CreatedAt;
                var comment = commentObject.Comment;
                con.query(`UPDATE main.Comments SET TalentId = ${talentId},FirstName = '${firstName}', LastName = '${lastName}', CreatedAt = '${createdat}', Comment = '${comment}'where CommentId = ${commentObject.CommentId}`, function (err, result, fields) {


                    if (err) res.status(500).json({ code: 500, err });
                    if (result) res.status(200).json({ code: 200, result });
                    if (fields) console.log(fields);
                });
            });
        } else {
            res.status(400).json({ code: 400, message: error });
        }

    }

    function deleteCommentsById(req, res){

        const { error, value } = joiValidation.commentIdSchema.validate(req.query);

        if (!error) {

            con.connect(function (err) {
                con.query(`DELETE FROM main.Comments where CommentId = ${event.pathParameters.CommentId}`, function (err, result, fields) {

                    if (err) res.status(500).json({ code: 500, err });
                    if (result) res.status(200).json({ code: 200, result });
                    if (fields) console.log(fields);
                });
            });
        } else {
            res.status(400).json({ code: 400, message: error });
        }
    }





    return {
        getAll: getAllCommentss,
        getById: getCommentsById,
        getByTalentId: getCommentsByTalentId,
        post: postComments,
        put: putComments,
        delete: deleteCommentsById

    }

}

module.exports = comments