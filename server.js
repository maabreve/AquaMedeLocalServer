// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors')

var config = require('./config.js');
var port = process.env.PORT || config.port;

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// db connection ===============================================================
mongoose.connect(config.url, { useMongoClient: true }).then(
  console.log('Success local database connection')
).catch(err => {
  console.log('Local database connection error - ', err)
});

// launch ======================================================================
const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});

// socket io
var io = require('socket.io')(server);
io.on('connection', function (socket) {
  console.log('socket connected!!!');
});

// routes ======================================================================
require('./routes.js')(app, mongoose, io);

// consolidates ================================================================
function consolidate() {
  console.log('Consolidate initialized!');

  // get registers

  // consolidate

  // delete registers
}

setInterval(consolidate, 300000);