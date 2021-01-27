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
            customer: 'cus_IfjppW291BfofB',
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
        proPrice: process.env.PREMIUM_PRICE_ID,
    });
});

// App configs
const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);
