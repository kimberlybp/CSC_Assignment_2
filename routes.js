const connect = require('./connect');
const talentDetails = require('./api/talentDetails')(connect);

function routes(app) {
    app.post('/api/postTalentDetails', talentDetails.post);
    app.get('/api/searchTalents', talentDetails.search);
}

module.exports = routes;
