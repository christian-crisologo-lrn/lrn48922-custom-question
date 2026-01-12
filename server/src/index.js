const http = require('http');
const express = require('express');
const cors = require('cors');
const Learnosity = require('learnosity-sdk-nodejs');

const PORT = 3001;

// key and secret from https://github.com/Learnosity/learnosity-sdk-nodejs
const LEARNOSITY_KEY = 'yis0TYCu7U9V4o7M';
const LEARNOSITY_SECRET = '74c5fd430cf1242a527f6223aebd42d30464be22';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/sign-learnosity-request', (req, res) => {
  const learnositySdk = new Learnosity();

  const response = learnositySdk.init(
    'items',
    {
      consumer_key: LEARNOSITY_KEY,
      domain: 'localhost',
    },
    LEARNOSITY_SECRET,
    req.body
  );

  console.log('Received request with session ID', req.body.session_id);

  res.send(response);
});

http.createServer(app).listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
