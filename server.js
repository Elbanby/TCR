const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      moment = require('moment'),
      mysql = require('mysql');

const cors = require('cors');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  
  var sql = "INSERT INTO CAT VALUES ( PetID, IntakeDate, Name, Photo, CurrentLocation, Neutered, VaccinationStatus, ‘2014-09-20’, ‘IDK’, ‘brown’, 10.2, ‘Male’, 11.2, 0, ‘2018-01-02’, ‘COolbEANS’, ‘NO STORY’, false, ‘Nuh’, ‘N notes’ )"
  
  //var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});


app.use(express.static('public'));
app.post('/api/addCat', (request, response) => {
  // Get AddCat request.
  const catObj = request.body;
  console.dir(catObj);
  
  //TODO: Add to DB.
  
  return response.json("Successfully added.\nThank you!");
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/api/test', (request, response) => {
  return response.json("Hello, friend");
});
app.get('/api/words', (request, response) => {
  //USAGE: /api/words?difficulty=hello
  
  console.dir(request.query);
  var difficulty = request.query.difficulty;
  var words = [];
  
  for (var i = 0; i < difficulty.length; i++) {
    words[i] = testWords[i];
  }
  
  return response.json(words);
});



// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
});

// Error Handling middleware.
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || 'Internal Server Error';
  }
  res.status(errCode).type('txt')
    .send(errMessage);
});

// listen for requests.
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
