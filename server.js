const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbService = require('./connect.js');
const app = express();

const envFilePath = path.resolve(__dirname, './.env');
const env = require('dotenv').config({ path: envFilePath });
if (env.error) {
    throw new Error(
        `Unable to load the .env file. Make sure to change .env.example to .env and add the keys required.`,
    );
}
app.use(express.json({ limit: '50mb' }));
app.use(express.static(process.env.STATIC_DIR));

// Body Parser Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// default URL for website
app.get('/', function (req, res) {
    const filePath = path.resolve(__dirname + '/src/index.html');
    res.sendFile(filePath);
});

app.get('/test', function (req, res) {
    const filePath = path.resolve(__dirname + '/src/test.html');
    res.sendFile(filePath);
});

//agolia
const agoliaSearch = require('algoliasearch');
const client = agoliaSearch(process.env.APP_KEY, process.env.ADMIN_KEY);
const index = client.initIndex('talents');
// const objects = [
//     {
//         objectID: 'myID1',
//         firstname: 'Jimmie',
//         lastname: 'Barninger',
//     },
//     {
//         objectID: 'myID2',
//         firstname: 'Warren',
//         lastname: 'Speach',
//     },
// ];

// index.saveObjects(objects).then(({ objectIDs }) => {
//     console.log(objectIDs);
// });
app.get('/search', function (req, res) {
    let array = [];
    let query = req.body.query;
    if (query) {
        index
            .search(query, {
                attributesToRetrieve: ['firstname', 'lastname'],
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

// pusher-test
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: '1150987',
    key: '3a44ea21cd9b397e8910',
    secret: '7de03a2b7535fdd9bf7b',
    cluster: 'ap1',
    useTLS: true,
});

app.post('/comment', function (req, res) {
    const db = dbService.getDbServiceInstance();
    //console.log(req.body);
    var newComment = {
        fname: req.body.name,
        lname: req.body.email,
        comment: req.body.comment,
    };
    const result = db.postComment(newComment.fname, newComment.lname, newComment.comment);
    result
        .then(res.send('Comment stored in database!'))
        .catch((err) => res.status(400).send(`Error adding comment: ${err}`));
    pusher.trigger('flash-comments', 'new_comment', newComment);
    res.json({ created: true });
});

// pusher.trigger('my-channel', 'my-event', {
//     message: 'hello world',
// });

require('./routes')(app);

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);
