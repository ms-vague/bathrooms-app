'use strict';
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const NodeGeocoder = require('node-geocoder');
const passport = require('passport');

const {router: usersRouter} = require('./users');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Bathroom} = require('./models');
const {User} = require('./users/models');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyD5Fc9IndJBZKyOerxJT8YSYFWBP7U-Au4',
  formatter: null
};

const geocoder = NodeGeocoder(options);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  if (req.method === 'OPTIONS') {
      return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/users', usersRouter);
app.use('/auth', authRouter);

const jwtAuth = passport.authenticate('jwt', {session: false});

// can I redirect user to results.html with successful login? //
app.get('/login', jwtAuth, (req, res) => {
  return res.json({
    data: "This is very difficult to crack."
  })
});



app.get('/users', jwtAuth, (req, res) => {
  User
  .find()
  .exec()
  .then(users => {
    console.log(users);
    res.json(users);
  })
  .catch(
    err => {
      console.error(err);
      res.status(500).json({message: "Server error. Can't get users"})
  });
});

app.get('/bathrooms', jwtAuth, (req, res) => {
 Bathroom
 .find()
 .exec()
 .then(bathrooms => {
  res.json(bathrooms);
 })
 .catch(
  err => {
   console.error(err);
   res.status(500).json({message: 'Internal server error'});
  });
});

app.get('/bathrooms/:id', (req, res) => {
  console.log(req);
  Bathroom
  .findById(req.params.id)
  .exec()
  .then(bathroom => res.json(bathroom))
  .catch(err => {
  console.error(err);
    res.status(500).json({message: 'Internal server error'})
  });
});

app.post('/bathrooms', (req, res) => {
 const requiredFields = ['type', 'city', 'name', 'address', 'zipcode'];
 const requiredAddressFields = [];
 requiredFields.forEach(field => {
  if (!(field in req.body && req.body[field])) {
    if (typeof req.body[field] === 'object') {
      Object.keys(req.body[field]).forEach(field => {
        const message = `Missing ${field} in request body.`;
        console.error(message);
        res.status(400).send(message);
      });
    } 
  }
});

const reqBodyAddress = `${req.body.street} ${req.body.state}`;

geocoder.geocode(reqBodyAddress, function(error, geoRes) {
  const [first] = geoRes;

  Bathroom.create({
      type: req.body.type,
      city: req.body.city,
      name: req.body.name,
      address: {
        street: req.body.street,
        state: req.body.state
      },
      zipcode: req.body.zipcode,
      coordinates: {
        lat: first.latitude,
        lng: first.longitude
      }
    })
    .then(newBathroom => {
      res.status(201).json(newBathroom);
    });
  });
});

// IDs don't match on Update //
app.put('/bathrooms/:id', (req, res) => {
 if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
  const message = (
   `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
  console.error(message);
  res.status(400).json({message: message});
 }
 const toUpdate = {};
 const updateableFields = ['type', 'city', 'name', 'address', 'zipcode'];

 updateableFields.forEach(field => {
  if (field in req.body) {
   toUpdate[field] = req.body[field];
  }
 });

 Bathroom
  // all key/value pairs in toUpdate will be updated -- that's what `$set` does
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .exec()
  .then(bathroom => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server error'}));
});

app.delete('/bathrooms/:id', (req, res) => {
 Bathroom
  .findByIdAndRemove(req.params.id)
  .exec()
  .then(bathroom => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server error'}));
});

app.use('*', (req, res) => {
  res.status(404).json({message: 'Error, not found.'});
});

let server;

// this function connects to our database, then starts the server
function runServer(database, port) {
  return new Promise((resolve, reject) => {
    mongoose.connect(database || DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port || PORT, () => {
        console.log(`Your app is listening on port ${port || PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};