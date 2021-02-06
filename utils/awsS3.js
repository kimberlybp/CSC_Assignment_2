const fs = require('fs');
const AWS = require('aws-sdk');

// Enter copied or downloaded access id and secret here
const ID = 'ASIA2K6NZQWHRABKOBGA';
const SECRET = 'xCTb0QvyVprvkAVOXy4Tcdp1S27/ywatPEhVVghR';
const sessionToken = 'FwoGZXIvYXdzEF4aDOLRBQxnOmDneWatBSLOAc/6Sm/u7dgSXnE1ib2fhNSPQvTGI4/IOSUKQukNq36lBZfw0sVeediOba8uzcbgoyMj+jLFT9K6+pWBttSa7Zab57dAYQQ1x/dw0Jir0sRPqBLSGaMlQ5tlDlCRCJImmIEsSSGQA2SQIcEuMcdfgTCmJUMVst5uJ94TtKPy7A/xHnpCQx02SQ5nMlWNUWmMCIV/XQhJQtn+30c5tBL6mvmmrhXZsAv04JMEEDJJ3Xjby/rQ2DIQ7AyfPPLsrjqJgFGYExWoNAJlU9En/lr5KNmR+oAGMi3JU76hceInckrZd7bTuCgG1k50Nir5eQiTuCl3Kd4uFZoPHXX6fsVqLspgDwg=';



// Initializing S3 Interface
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    sessionToken: sessionToken,

});

module.exports = s3;