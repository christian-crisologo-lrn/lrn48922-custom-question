const http = require('http');
const express = require('express');
const cors = require('cors');
const Learnosity = require('learnosity-sdk-nodejs');
const {
  getPort,
  getServerUrl,
  getLearnosityCredentials,
  getLearnosityDomain,
} = require('./config');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/sign-learnosity-request', (req, res) => {
  const learnositySdk = new Learnosity();
  const credentials = getLearnosityCredentials();
  const domain = getLearnosityDomain();

  const response = learnositySdk.init(
    'items',
    {
      consumer_key: credentials.consumerKey,
      domain: domain,
    },
    credentials.secret,
    req.body
  );

  console.log('Received request with session ID', req.body.session_id);

  res.send(response);
});

const port = getPort();
const serverUrl = getServerUrl();

http.createServer(app).listen(port, () => {
  console.log(`Server listening at ${serverUrl}`);
});
