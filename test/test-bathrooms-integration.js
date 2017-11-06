const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {Bathroom} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL, TEST_PORT} = require('../config');

chai.use(chaiHttp);

function seedBathroomData() {
 console.info('seeding bathroom data');
 //console.log('BATHROOM DATA', generateBathroomData());
 const seedData = [];

 for (let i = 1; i <= 3; i++) {
  seedData.push(generateBathroomData());
 }

 return Bathroom.insertMany(seedData);
}

function generateTypeData() {
 const types = ['gendered', 'neutral'];
   return types[Math.floor(Math.random() * types.length)];
}

function generateCityData() {
 const cities = ['New Orleans', 'Boulder', 'Metairie'];
   return cities[Math.floor(Math.random() * cities.length)];
}

function generateBathroomData() {
 return {
   type: generateTypeData(),
   city: generateCityData(),
   name: faker.company.companyName(),
   address: {
     street: faker.address.streetName(),
     state: faker.address.state()
   },
  /*coords: {
     lat: faker.address.latitude(),
     lng: faker.address.longitude()
   },*/
   zipcode: faker.address.zipCode(),
 }
}

function tearDownDb() {
  console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Bathrooms API resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, TEST_PORT);
  });

  beforeEach(function() {
   return seedBathroomData();
  })

  afterEach(function() {
   return tearDownDb();
  })

  after(function() {
   return closeServer();
  })

  describe('GET endpoint', function() {
   it('should return all existing bathroom locations', function() {

    let res;
    return chai.request(app)
     .get('/bathrooms')
     .then(function(_res) {

     res = _res;
     res.should.have.status(200);
     res.body.should.have.length.of.at.least(1);
     return Bathroom.count();
    })
     .then(function(count) {
      res.body.should.have.lengthOf(count);
     });
   });

   it('should return bathrooms with right fields', function() {

    let resBathroom;
    return chai.request(app)
     .get('/bathrooms')
     .then(function(res) {
       res.should.have.status(200);
       res.should.be.json;
       res.body.should.be.a('array');
       res.body.should.have.length.of.at.least(1);

       res.body.forEach(function(bathroom) {
         bathroom.should.include.keys('type', 'city', 'name', 'address', 'zipcode');
       });

       resBathroom = res.body[0];
       return Bathroom.findById(resBathroom.id);
     })
   });
  });


  describe('POST endpoint', function() {

   it('should add a new bathroom location', function() {
     const newBathroom = generateBathroomData();
     console.log('NEW BATHROOM', newBathroom);
     return chai.request(app)
       .post('/bathrooms')
       .send(newBathroom)
       .then(function(res) {
         res.should.have.status(201);
         res.should.be.json;
         res.body.should.be.a('object');
         res.body.should.include.keys('id', 'type', 'city', 'name', 'address', 'zipcode');
         res.body.id.should.not.be.null;
         res.body.type.should.equal(newBathroom.type);
         res.body.city.should.equal(newBathroom.city);
         res.body.name.should.equal(newBathroom.name);
         res.body.address.street.should.equal(newBathroom.address.street);
         res.body.address.state.should.equal(newBathroom.address.state);
         //res.body.coords.lat.should.equal(newBathroom.coords.lat);
         //res.body.coords.lng.should.equal(newBathroom.coords.lng);
         res.body.zipcode.should.equal(newBathroom.zipcode);

         return Bathroom.findById(res.body.id);
       })
       .then(function(bathroom) {
         bathroom.type.should.equal(newBathroom.type);
         bathroom.city.should.equal(newBathroom.city);
         bathroom.name.should.equal(newBathroom.name);
         bathroom.address.street.should.equal(newBathroom.address.street);
         bathroom.address.state.should.equal(newBathroom.address.state);
         //bathroom.coords.lat.should.equal(newBathroom.coords.lat);
         //bathroom.coords.lng.should.equal(newBathroom.coords.lng);
         bathroom.zipcode.should.equal(newBathroom.zipcode);
       });
    });

   /*it('', function() {
    console.log(generateBathroomData());
   });*/
  });

  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        type: 'foo',
        city: 'bar',
        name: 'bizz',
        hours: 'bang',
        address: {
          street: 'boop',
          state: 'bloop'
        },
        zipcode: 'beep'
        /*coords: {
          lat: '20.1546161',
          lng: '90.5464213'
        }*/
      };

      return Bathroom
        .findOne()
        .exec()
        .then(function(bathroom) {
          updateData.id = bathroom.id;

          return chai.request(app)
          .put(`/bathrooms/${bathroom.id}`)
          .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(204);

          return Bathroom.findById(updateData.id).exec();
        })
        .then(function(bathroom) {
          bathroom.type.should.equal(updateData.type);
          bathroom.city.should.equal(updateData.city);
          bathroom.name.should.equal(updateData.name);
          bathroom.address.street.should.equal(updateData.address.street);
          bathroom.address.state.should.equal(updateData.address.state);
          bathroom.zipcode.should.equal(updateData.zipcode);
        });
    });
  });

  describe('DELETE endpoint', function() {

    it('should delete a post by id', function() {

      let bathroom;

      return Bathroom
        .findOne()
        .exec()
        .then(function(_bathroom) {
          bathroom = _bathroom;
          return chai.request(app).delete(`/bathrooms/${bathroom.id}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return Bathroom.findById(bathroom.id).exec();
        })
        .then(function(_bathroom) {
          should.not.exist(_bathroom);
        });
    });
  });
});