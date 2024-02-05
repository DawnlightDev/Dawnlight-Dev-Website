// handler.js

const express = require('express');
const serverless = require('serverless-http');
const app = express();

// Your existing server code goes here

module.exports.handler = serverless(app);
