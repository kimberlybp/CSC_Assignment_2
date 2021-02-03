const connect = require('./connect');
const talentDetails = require('./api/talentDetailsAPI')(connect);


function routes(app) {

    app.get('/api/TalentDetails/getAll', talentDetails.getAll);
    app.get('/api/TalentDetails/getById', talentDetails.getById);
    app.post('/api/TalentDetails/post',talentDetails.post);
    app.put('/api/TalentDetails/put',talentDetails.put);
    app.delete('/api/TalentDetails/delete',talentDetails.delete);

}

module.exports = routes;