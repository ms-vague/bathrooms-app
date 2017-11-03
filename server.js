const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const NodeGeocoder = require('node-geocoder');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Bathroom} = require('./models');

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

app.get('/bathrooms', (req, res) => {
 Bathroom
 .find()
 .exec() //query builder interface
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

Bathroom
 .create({
  type: req.body.type,
  city: req.body.city,
  name: req.body.name,
  address: {
    street: req.body.address.street,
    state: req.body.address.state
  },
  /*coords: {
    lat: req.body.coords.lat,
    lng: req.body.coords.lng
  },*/
  zipcode: req.body.zipcode
})
 .then(bathroom => {
    const address = `${bathroom.address.street} ${bathroom.address.state}`; 
    geocoder.geocode(address, function(err, geoRes) {
      // ES6 Array destructuring //
      const [first] = geoRes;
      //console.log(first);
      // Es6 Object.assign //
      const geoBathroom = Object.assign({}, first, bathroom.apiRepr());
      res.status(201).json(geoBathroom);
    })
 })
 .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
 });
});

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

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
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