const connect = require('./connect');
const s3 = require('./utils/awsS3');
const talentDetails = require('./api/talentDetails')(connect, s3);


function routes(app) {
    app.post('/api/postTalentDetails',talentDetails.post);
    app.post('/api/postTalentWithFirebase', talentDetails.postWithFirebase);
    app.post('/api/postTalentProfilePicture', talentDetails.postProfilePicture);
}

module.exports = routes;