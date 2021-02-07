const fs = require('fs');
const AWS = require('aws-sdk');

// Enter copied or downloaded access id and secret here
const ID = 'ASIA2K6NZQWH3D5UWOI5';
const SECRET = 'nTFw9HEZon/MJxF6iU2mP2arK4ZhaG3Nw/Fkr6tF';
const sessionToken = 'FwoGZXIvYXdzEGgaDJukXNlQvDgf9/rFmCLOAUsYG+qNFvd/XF7OpZHmWI9yn/rSyvQhxdFd5W9i4ZGPi7H7N7xzAtHroNOWT8gZNDwuvf+EUTQDfvlTRGOeoVpf22P8tH9ihuxCqnnsbo6kMaMcz3B18i/Qwj4SSIyi4gW7y5FX3RyhHje7NpiZ6e0zLoTQh9P/M511WrmltHjwoFU92hbNajd3qjFyhFWN2u8aZbKCyf1o0I870kkWkL8/oeNPrXkZt7MEDaoPzIdTUwjrSdypr5xuFeCVtg57q2TBOLktg1w14DQHLnA/KPSy/IAGMi0KiYE+KA0D/uf/8zkUJ2ot4SWcrmgJYl6HzosCaoJtYN5k0YumB/sejdmw45A=';



// Initializing S3 Interface
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    sessionToken: sessionToken,

});

module.exports = s3;