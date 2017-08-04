const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
const should = chai.should();

const {Bathroom} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedBathroomData() {
 console.info('seeding bathroom data');
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
 const cities = ['New Orleans', 'Denver', 'Metairie'];
   return cities[Math.floor(Math.random() * cities.length)];
}

function generateHoursData() {
 const hours = ['24 hrs', '10am - 10pm', '12pm - 10pm'];
   return hours[Math.floor(Math.random() * hours.length)];
}

function generateBathroomData() {
 return {
   type: generateTypeData(),
   city: generateCityData(),
   name: faker.company.companyName(),
   hours: generateHoursData(),
   address: {
     street: faker.address.streetName(),
     zipcode: faker.address.zipCode()
   }
 }
}

function tearDownDb() {
  console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Bathrooms API resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
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
     res.body.bathrooms.should.have.lengthOf.at.least(1);
     return Bathroom.count();
    })
     .then(function(count) {
      res.body.bathrooms.should.have.lengthOf(count);
     });
   });

   it('should return bathrooms with right fields', function() {

    let resBathroom;
    return chai.request(app)
     .get('/bathrooms')
     .then(function(res) {
       res.should.have.status(200);
       res.should.be.json;
       res.body.bathrooms.should.be.a('array');
       res.body.bathrooms.should.have.length.of.at.least(1);

       res.body.bathrooms.forEach(function(bathroom) {
         bathroom.should.be.a('object');
         bathroom.should.include.keys('id', 'type', 'city', 'name', 'hours', 'address');
       });

       resBathroom = res.body.bathrooms[0];
       return Bathroom.findById(resBathroom.id);
     })
     .then(function(bathroom) {

       resBathroom.id.should.equal(bathroom.id);
       resBathroom.type.should.equal(bathroom.type);
       resBathroom.city.should.equal(bathroom.city);
       resBathroom.name.should.equal(bathroom.name);
       resBathroom.hours.should.equal(bathroom.hours);
       resBathroom.address.should.contain(bathroom.address.street);
     });
   });
  });


  describe('POST endpoint', function() {

   it('should add a new bathroom location', function() {
     const newBathroom = generateBathroomData();

     return chai.request(app)
       .post('/bathrooms')
       .send(newBathroom)
       .then(function(res) {
         res.should.have.status(201);
         res.should.be.json;
         res.body.should.be.a('object');
         res.body.should.include.keys('id', 'type', 'city', 'name', 'hours', 'address');
         res.body.id.should.not.be.null;
         res.body.type.should.equal(newBathroom.type);
         res.body.city.should.equal(newBathroom.city);
         res.body.name.should.equal(newBathroom.name);
         res.body.hours.should.equal(newBathroom.hours);
         res.body.address.should.equal(`${newBathroom.address.street} ${newBathroom.address.zipcode}`);

         return Bathroom.findById(res.body.id);
       })
       .then(function(bathroom) {
         bathroom.type.should.equal(newBathroom.type);
         bathroom.city.should.equal(newBathroom.city);
         bathroom.name.should.equal(newBathroom.name);
         bathroom.hours.should.equal(newBathroom.hours);
         bathroom.address.street.should.equal(newBathroom.address.street);
         bathroom.address.zipcode.should.equal(newBathroom.address.zipcode);
       });
    });
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
          zipcode: 'beep'
        }
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
          bathroom.hours.should.equal(updateData.hours);
          bathroom.address.street.should.equal(updateData.address.street);
          bathroom.address.zipcode.should.equal(updateData.address.zipcode);
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