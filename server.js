const http = require('http');
const express = require('express');
const path = require('path');
const app = express();

const envFilePath = path.resolve(__dirname, './.env');
const env = require('dotenv').config({ path: envFilePath });
if (env.error) {
    throw new Error(
        `Unable to load the .env file. Make sure to change .env.example to .env and add the keys required.`,
    );
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.json({ limit: '50mb' }));
app.use(express.static(process.env.STATIC_DIR));

// default URL for website
app.get('/', function (req, res) {
    const filePath = path.resolve(__dirname + '/src/index.html');
    res.sendFile(filePath);
});

app.get('/subscribe', function (req, res) {
    const filePath = path.resolve(__dirname + '/src/subscribe.html');
    res.sendFile(filePath);
});

app.get('/setup', async (req, res) => {
    var cid = '';
    var stripeUserRef = database.ref('stripe_users');
    var oneRow = stripeUserRef.child(firebase.auth().currentUser.uid);
    oneRow.once('value', function (snap) {
        snap.val()
            ? res.send({
                  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
                  starterPrice: process.env.STARTER_PRICE_ID,
                  basicPrice: process.env.BASIC_PRICE_ID,
                  premiumPrice: process.env.PREMIUM_PRICE_ID,
                  customer_id: snap.val().customer_id,
                  customer_email: firebase.auth().currentUser.email,
              })
            : res.send({
                  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
                  starterPrice: process.env.STARTER_PRICE_ID,
                  basicPrice: process.env.BASIC_PRICE_ID,
                  premiumPrice: process.env.PREMIUM_PRICE_ID,
                  customer_id: null,
                  customer_email: firebase.auth().currentUser.email,
              });
    });
});

// App configs
const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);
