const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const envFilePath = path.resolve(__dirname, './.env');
const env = require("dotenv").config({ path: envFilePath });
if (env.error) {
  throw new Error(`Unable to load the .env file. Make sure to change .env.example to .env and add the keys required.`);
}

app.use(express.json({limit: '50mb'}));
app.use(express.static(process.env.STATIC_DIR));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb'}));

// default URL for website
app.get('/', function (req, res) {
    const filePath = path.resolve(__dirname + "/src/index.html");
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

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);

