const connect = require('./connect');
const talentDetails = require('./api/talentDetails')(connect);

function routes(app) {
    app.post('/api/postTalentDetails', talentDetails.post);
    app.post('/api/searchTalents', talentDetails.search);
}

module.exports = routes;
