const connect = require('./connect');
const talentDetails = require('./api/talentDetailsAPI')(connect);
const comments = require('./api/commentsAPI')(connect);


function routes(app) {

    app.get('/api/TalentDetails/getAll', talentDetails.getAll);
    app.get('/api/TalentDetails/getById', talentDetails.getById);
    app.post('/api/TalentDetails/post',talentDetails.post);
    app.put('/api/TalentDetails/put',talentDetails.put);
    app.delete('/api/TalentDetails/delete',talentDetails.delete);

    app.get('/api/comments/getAll', comments.getAll);
    app.get('/api/comments/getById', comments.getById);
    app.get('/api/comments/getByTalentId', comments.getByTalentId);

}

module.exports = routes;