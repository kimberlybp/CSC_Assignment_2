const fs = require('fs');
const AWS = require('aws-sdk');

// Enter copied or downloaded access id and secret here
const ID = 'ASIA2K6NZQWHSYN3I7OK';
const SECRET = 'KchDohe2pr/E9UzZlKGKEYWSxba2shdCZ/x+/Oax';
const sessionToken = 'FwoGZXIvYXdzEC0aDFEqMOP1TwMk56zwGSLOAYDgPt/I0Ad1XaLZCwpCgqe1tBeB7KgmGMBa9rahxn805wrO9mkZbLZfwAeCAxlHb1j8e4jpwu6mO2OibzxIFGAFlm3PqtvfNDAkkuD9YAUQWbBaKps0fFEzXUAep/ukr2fDhatKOAMdSytrsYNQKZYENMiRsiGlJG3ZqX2Ua5nSXUXvHVTm7wohlglfYPXvnBPZZsxCmDfxYo3VX0RsnZZmFvgk4M/Wsqm+dGLkwnzUYRNorkqRFgJHIfzTZOgeq2pJqxdXEl2UGWTpr3UGKIay74AGMi1PZkrMYr+Tzm6cFhejjYRa9h+8SU4kjiNqCwk1LX92q5euDWF+mKEcTcrRPKI=';



// Initializing S3 Interface
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    sessionToken: sessionToken,

});

module.exports = s3;