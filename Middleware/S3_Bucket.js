const AWS = require('aws-sdk');
require('dotenv').config(); // Load environment variables from .env file

// Function to configure and return S3 instance with DigitalOcean Space credentials
const configureS3 = () => {
    // Configure AWS with DigitalOcean Space credentials
    const spacesEndpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY
    });

    return s3;
};

module.exports = configureS3;
