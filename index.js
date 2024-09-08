// Import required modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Create an instance of the Express app
const app = express();
let bodyParser = require('body-parser')
// Basic Configuration
const port = process.env.PORT || 3000;


// Enable CORS and JSON parsing
app.use(cors());
//app.use(express.json());
app.use('/', bodyParser.urlencoded({ extended: false }))

//UI
app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Simulate a database with an array
let db = [];
let idCounter = 0;

// Function to insert a new URL into the database
function insertURL(url) {
  db.push({ original_url: url, short_url: idCounter });
  idCounter++;
}

// API endpoint to return a greeting
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello APIx' });
});

// API endpoint to redirect to an original URL
app.get('/api/shorturl/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!db[id]) {
    res.json({ error: 'URL not found in db' });
  } else {
    res.redirect(db[id].original_url);
  }
});

function validateURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i'
  );
  return pattern.test(str);
}

// API endpoint to create a short URL
app.post('/api/shorturl', (req, res) => {

  const { url } = req.body;

  if (validateURL(url)) {
    insertURL(url);
    res.json({ original_url: url, short_url: db[db.length - 1].short_url });
  } else {
    res.json({ error: 'invalid url' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});