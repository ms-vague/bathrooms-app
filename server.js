const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Bathrooms} = require('./models');

const app = express();
app.use(bodyParser.json());

app.get('/bathrooms', (req, res) => {
	Bathrooms
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
	Bathrooms
	.findById(req.params.id)
	.exec()
	.then(bathroom => res.json(bathroom.apiRepr()))
	.catch(err => {
		res.status(500).json({message: 'Internal server error'})
	});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

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

if (require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};