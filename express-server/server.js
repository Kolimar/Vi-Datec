// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// Get our API routes
const movies = require('./routes/api');
const uploadRoutes = require('./routes/uploads');


// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://database/vidatec';
// Connect to mongodb
mongoose.connect(dbHost,(err, res) => {
  if (err) throw err;
  console.log('Database: \x1b[32m%s\x1b[0m', 'online');
});


const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cross Origin middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  
  next()
})

// Set our api routes
app.use('/csv', uploadRoutes);
app.use('/movies', movies);

/* GET api listing. */
app.get('/', (req, res) => {
  res.send('api works');
});


/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));