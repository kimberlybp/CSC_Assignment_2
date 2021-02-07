const connect = require('./connect');
const s3 = require('./utils/awsS3');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');
const serviceAccount = require('./csc-assignment-2-892e3-firebase-adminsdk-be5vp-bbe82c57f4.json');
admin.initializeApp(
    //functions.config().firebase
    { credential: admin.credential.cert(serviceAccount) },
);

const firestore = admin.firestore();
const agoliaSearch = require('algoliasearch');
const client = agoliaSearch(process.env.ALGOLIA_APP_KEY, process.env.ALGOLIA_ADMIN_KEY);
const algoliaIndex = client.initIndex('talents');

const talentDetails = require('./api/talentDetails')(connect, s3, firestore, algoliaIndex);
const plans = require('./api/plans')(connect);
const stripeApi = require('./api/stripe')(stripe);


function routes(app) {
    app.post('/api/postTalentDetails',talentDetails.post);
    app.post('/api/postTalentWithFirebase', talentDetails.postWithFirebase);
    app.post('/api/postTalentProfilePicture', talentDetails.postProfilePicture);
    app.post('/api/postUserSubscriptionPlan', talentDetails.postUserSubscriptionPlan);
    app.get('/api/getTalentDetailsByFirebase', talentDetails.getTalentDetailsByFirebase);
    app.get('/api/getAllPlans', plans.getAll);
    app.post('/api/createFreeCheckoutSession', stripeApi.createFreeCheckoutSession);
    app.post('/api/createPaidCheckoutSession', stripeApi.createPaidCheckoutSession);
    app.get('/api/getCheckoutSessionData', stripeApi.getCheckoutSessionData);
    app.post('/api/createNewCustomer', stripeApi.createNewCustomer);
    app.post('/api/searchTalents', talentDetails.search);
    app.post('/api/addTalentToAlgolia', talentDetails.addTalentToAlgolia);
}

module.exports = routes;
