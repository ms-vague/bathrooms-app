const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Bathroom} = require('./models');

const app = express();
app.use(bodyParser.json());
<<<<<<< HEAD

app.get('/bathrooms', (req, res) => {
	Bathroom
	.find()
	.exec()
	.then(bathrooms => {
		res.json({
			bathrooms: bathrooms.map(
				(bathroom) => bathroom.apiRepr())
		});
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
	.then(bathroom => res.json(bathroom.apiRepr()))
	.catch(err => {
		console.error(err);
			res.status(500).json({message: 'Internal server error'})
	});
});

app.post('/bathrooms', (req, res) => {
	const requiredFields = ['type', 'city', 'name', 'hours'];
	requiredFields.forEach(field => {
		if (!(field in req.body && req.body[field])) {
			res.status(400).json({message: `Must specify value for ${field}`});
		}
	});

	Bathroom
	.create({
		type: req.body.type,
		city: req.body.city,
		name: req.body.name,
		hours: req.body.hours,
		address: req.body.address
	})
	.then(
		bathroom => res.status(201).json(bathroom.apiRepr()))
	.catch(err => {
		console.error(err);
		res.status(500).json({message: 'Internal server error'});
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
	const updateableFields = ['type', 'city', 'name', 'hours', 'address'];

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
=======
app.use(express.static('public'));

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
 const requiredFields = ['type', 'city', 'name', 'street', 'zipcode'];
 requiredFields.forEach(field => {
  if (!(field in req.body && req.body[field])) {
   res.status(400).json({message: `Must specify value for ${field}`});
  }
 });

 Bathroom
 .create({
  type: req.body.type,
  city: req.body.city,
  name: req.body.name,
  address: {
    street: req.body.street,
    coords: {
      lat: req.body.lat,
      lng: req.body.lng
    },
  },
  zipcode: req.body.zipcode
 })
 .then(
  (bathroom) => res.status(201).json(bathroom.apiRepr()))
 .catch(err => {
  console.error(err);
  res.status(500).json({message: 'Internal server error'});
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
 const updateableFields = ['type', 'city', 'name', 'street', 'zipcode'];

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
>>>>>>> feature/tests
});

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

// this function connects to our database, then starts the server
function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
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