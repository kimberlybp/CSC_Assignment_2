const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const dbService = require('./connect.js');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());
app.use(cors());

const envFilePath = path.resolve(__dirname, './.env');
const env = require('dotenv').config({ path: envFilePath });
if (env.error) {
    throw new Error(
        `Unable to load the .env file. Make sure to change .env.example to .env and add the keys required.`,
    );
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
app.use(express.static(process.env.STATIC_DIR));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb'}));

// default URL for website
app.get('/', function (req, res) {
    const filePath = path.resolve(__dirname + '/src/views/index.html');
    res.sendFile(filePath);
});

app.get('/login', function (req, res) {
  const filePath = path.resolve(__dirname + "/src/views/login.html");
  res.sendFile(filePath);
});

app.get('/signup', function (req, res) {
  const filePath = path.resolve(__dirname + "/src/views/signUp.html");
  res.sendFile(filePath);
});
//agolia
const agoliaSearch = require('algoliasearch');
const client = agoliaSearch(process.env.APP_KEY, process.env.ADMIN_KEY);
const index = client.initIndex('talents');

app.get('/setUpProfile', function (req, res) {
  const filePath = path.resolve(__dirname + "/src/views/setUpProfile.html");
  res.sendFile(filePath);

});

// async function initialUpload() {
//     await fetch('https://amqlyvytfc.execute-api.us-east-1.amazonaws.com/live/talentdetail')
//         .then((res) => res.json())
//         .then((data) => {
//             console.log(data);
//             index
//                 .saveObjects(data)
//                 .then(({ objectIDs }) => {
//                     console.log(objectIDs);
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 });
//         });
// }
// initialUpload();

app.get('/search', function (req, res) {
    let array = [];
    let query = req.query.query;
    if (query) {
        index
            .search(query, {
                attributesToRetrieve: [
                    'objectID',
                    'TalentId',
                    'FirstName',
                    'LastName',
                    'Description',
                    'Gender',
                    'Age',
                    'Interst',
                ],
                hitsPerPage: 50,
            })
            .then(({ hits }) => {
                Object.values(hits).forEach((value) => {
                    array.push(value);
                });
                if (array.length > 0) {
                    res.send({ data: hits });
                } else res.send(`No record(s) available.`);
            })
            .catch((err) => res.status(400).send(`Error executing search: ${err}`));
    } else res.status(400).send(`Please provide a query string.`);

});

app.get('/setUpPlan', function (req, res) {
    const filePath = path.resolve(__dirname + "/src/views/setUpPlan.html");
    res.sendFile(filePath);
  });

app.get('/home', function (req, res) {
  const filePath = path.resolve(__dirname + "/src/views/index.html");
  res.sendFile(filePath);
});

app.get('/paymentSetupSuccess', function (req, res) {
    const filePath = path.resolve(__dirname + "/src/views/paymentSetupSuccess.html");
    res.sendFile(filePath);
  });

  app.get('/discover', function (req, res) {
    const filePath = path.resolve(__dirname + '/src/views/discover.html');
    res.sendFile(filePath);
});

  app.get('/search', function (req, res) {
    const filePath = path.resolve(__dirname + "/src/talentDetails.html");
    res.sendFile(filePath);
  });

  app.get('/profile', function (req, res) {
    const filePath = path.resolve(__dirname + "/src/views/profile.html");
    res.sendFile(filePath);
  });

  app.get('/profile', function (req, res) {
    const filePath = path.resolve(__dirname + "/src/views/profile.html");
    res.sendFile(filePath);
  });

  app.get('/weixian', function (req, res) {
    const filePath = path.resolve(__dirname + "/src/views/talentDetails.html");
    res.sendFile(filePath);
  });

  app.get('/viewIndividualTalent', function (req, res) {
    const filePath = path.resolve(__dirname + "/src/views/viewIndividualTalent.html");
    res.sendFile(filePath);
  });



require('./routes')(app);

app.get('/subscribe', function (req, res) {
    const filePath = path.resolve(__dirname + '/src/views/subscribe.html');
    res.sendFile(filePath);
});

// listens to stripe webhook (TODO AGAIN)
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

function createDateTimeString(timestamp) {
    var date = new Date(timestamp * 1000);
    var datetimeString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    return datetimeString;
}

// App configs
const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port);
console.debug('Server listening on port ' + port);
