const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Firebase config
const admin = require('firebase-admin');
const serviceAccount = require('./csc-assignment-2-436b4-firebase-adminsdk-mltrx-144eb9f622.json');
admin.initializeApp(
    //functions.config().firebase
    { credential: admin.credential.cert(serviceAccount) },
);
const db = admin.firestore();
//

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

// Body Parser Middleware
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb'}));

// default URL for website
app.get('/', function (req, res) {
    const filePath = path.resolve(__dirname + '/src/index.html');
    res.sendFile(filePath);
});

app.get('/login', function (req, res) {
  const filePath = path.resolve(__dirname + "/src/login.html");
  res.sendFile(filePath);
});

app.get('/signup', function (req, res) {
  const filePath = path.resolve(__dirname + "/src/signUp.html");
  res.sendFile(filePath);
});

app.get('/signup/setUpProfile', function (req, res) {
  const filePath = path.resolve(__dirname + "/src/setUpProfile.html");
  res.sendFile(filePath);
});

app.get('/home', function (req, res) {
  const filePath = path.resolve(__dirname + "/src/home.html");
  res.sendFile(filePath);
});


require('./routes')(app);

app.get('/subscribe', function (req, res) {
    const filePath = path.resolve(__dirname + '/src/subscribe.html');
    res.sendFile(filePath);
});

app.post('/customer-portal', async (req, res) => {
    const session = await stripe.billingPortal.sessions.create({
        customer: '',
        return_url: 'http://localhost:3000/index.html',
    });
    sessionURL = session.url;
    res.redirect(session.url);
});

app.get('/checkout-session', async (req, res) => {
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.send(session);
});

app.post('/create-checkout-session', async (req, res) => {
    const domainURL = process.env.DOMAIN;
    const { priceId } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            customer: 'cus_IsSUtl1SoibEnx',
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
            success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domainURL}/canceled.html`,
        });

        res.send({
            sessionId: session.id,
        });
    } catch (e) {
        res.status(400);
        return res.send({
            error: {
                message: e.message,
            },
        });
    }
});

app.post('/customer-portal-byId', async (req, res) => {
    const { customerId } = req.body;

    const portalsession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: process.env.DOMAIN,
    });

    res.send({
        url: portalsession.url,
    });
});

app.get('/setup', (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        freePrice: process.env.FREE_PRICE_ID,
        proPrice: process.env.PREMIUM_PRICE_ID,
    });
});

// app.post('/student', async (req, res) => {
//     username = req.body.name;
//     // email = req.body.email;

//     const docRef = db.collection('users').doc(username);
//     await docRef
//         .set({
//             gender: 'male',
//             FIN: '12345',
//             hobby: 'sleep',
//         })
//         .then(console.log(`user added!`))
//         .catch((err) => {
//             console.log(`adding failed`, err);
//         });
// });

// listens to webhook
app.post('/webhook', (request, response) => {
    const event = request.body;

    try {
        switch (event.type) {
            case 'customer.subscription.created':
                sendToDB(
                    event.id,
                    event.data.object.id,
                    event.type,
                    createDateTimeString(event.created),
                    event.created,
                    event.data.object.plan.product,
                );
                break;
            //any changes to subscription such as upgrading or donwgrading to another plan
            case 'customer.subscription.updated':
                sendToDBAgain(
                    event.id,
                    event.data.object.id,
                    event.type,
                    createDateTimeString(event.created),
                    event.created,
                    event.data.object.plan.product,
                );
                break;
            //if customer cancels subscription
            case 'customer.subscription.deleted':
                sendToDB(
                    event.id,
                    event.data.object.id,
                    event.type,
                    createDateTimeString(event.created),
                    event.created,
                    event.data.object.plan.product,
                );
                break;

            default:
            // console.log(`Unhandled event type ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event
        response.json({ received: true });
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }
});

async function sendToDB(eventid, id, type, datetime, timestamp, product) {
    var obj = {
        eventid: eventid,
        id: id,
        type: type,
        createdAt: datetime,
        timestamp: timestamp,
        product: product,
    };
    //console.log(obj);

    var oneRow = db.collection('subscription-log').doc(obj.id);

    await oneRow
        .set(obj)
        .then(console.log(`object added!`))
        .catch((err) => {
            console.log(`adding failed`, err);
        });
}

async function sendToDBAgain(eventid, id, type, datetime, timestamp, product) {
    var obj = {
        eventid: eventid,
        id: id,
        type: type,
        createdAt: datetime,
        timestamp: timestamp,
        product: product,
    };
    //console.log(obj);

    var oneRow = db.collection('subscription-log').doc(obj.id);

    await oneRow
        .update(obj)
        .then(console.log(`object added!`))
        .catch((err) => {
            console.log(`adding failed`, err);
        });
}

function createDateTimeString(timestamp) {
    var date = new Date(timestamp * 1000);
    var datetimeString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    return datetimeString;
}

// App configs
const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);
