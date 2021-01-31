const connect = require('./connect');
const talentDetails = require('./api/talentDetails')(connect);


function routes(app) {


    app.post('/api/postTalentDetails',talentDetails.post)

}

module.exports = routes;