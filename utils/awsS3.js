const fs = require('fs');
const AWS = require('aws-sdk');

// Enter copied or downloaded access id and secret here
const ID = 'ASIA2K6NZQWH5OYHEIHF';
const SECRET = 'B2VW7Ho/ylAfTJqy0vqt0p+HIVFHnObPYMU0slGV';
const sessionToken = 'FwoGZXIvYXdzEGMaDPjgu/SAfXSlTozxWSLOATE+J8RheB+y5BcLtXWO+3sUrmAVJTPqEHEcIu5C3fsR+ZRs9T5Sbtf7SsTvf1GXRn/67U/W8/hOSKhjKKAj4MP7eKtlJtZzQrvTGwuQpKPIoDeLQPJv7Aed4TesCGlQNSGN6YrbOrWBkc9iLFVffhcDATzI8STCUW/Jkv/c5mMYgzSkgX2w6BXNz7sy65QYUQF+jZxlUhnoO9jRyuCvPofuBG78fugM1Olu7htpxq3EAEK0M2Ruygkm8MlkDtK+0SwFyhLQisjEKo9fyk+DKLCz+4AGMi2ycL/fIVj0LpOuAOzXyPvxod81ykTIvTRuu+SN+o2ijk4/vpYOPVX4BjTnz1M=';



// Initializing S3 Interface
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    sessionToken: sessionToken,

});

module.exports = s3;