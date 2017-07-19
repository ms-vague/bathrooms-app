/*const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {Bathrooms} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

function seedBathroomData() {
	console.info('seeding bathoom data');
	const seedData = [];

	for (let i = 1; 1 <= 10; i++) {
		seedData.push(generateBathroomData());
	}

	return Bathrooms.insertMany(seedData);
}

function generateHours() {
	const hours = ['12 - 5', '24 hrs', '9 - 5'];
	return hours[Math.floor(Math.random() * hours.length)];
}

function generateType() {
	const types = ['neutral', 'gendered'];
	return types[Math.floor(Math.random() * types.length)];
}

function generateBathroomData() {
	return {
		name: faker.company.companyName(),
		hour: generateHours(),
		type: generateType()
	}
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('Bathrooms API resource', function() {
	before(function() {
		return runServer(port);
	});

	beforeEach(function() {
		return seedBathroomData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	describe('GET endpoint', function() {
		it('should return all existing restaurants', function() {

			let res;
			return chai.request(app)
			.get('/bathrooms')
			.then(function(_res) {
				res = _res;
				res.should.have.status(200);
				res.body.bathrooms.should.have.length.of.at.least(1);
				return Bathrooms.count();
			})
			.then(function(count) {
				res.body.bathrooms.should.have.length.of(count);
			});
		});

		it('should return bathrooms with the correct fields', function() {
			
			let resBathroom;
			return chai.request(app)
			.get('/bathrooms')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.bathrooms.should.be.a('array');
				res.body.bathrooms.should.have.a.length.of.at.least(1);

				res.body.bathrooms.forEach(function(bathroom) {
					bathroom.should.be.a('object');
					bathroom.should.include.keys(
						'id', 'name', 'hours', 'type');
				});
				resBathroom = res.body.bathrooms[0];
				return Bathrooms.findById(resBathroom.id);
			})
			.then(function(bathroom) {
				resBathroom.id.should.equal(bathroom.id);
				resBathroom.name.should.equal(bathroom.name);
				resBathroom.hours.should.equal(bathroom.hours);
				resBathroom.type.should.equal(bathroom.type);
			});
		});
	});
});*/