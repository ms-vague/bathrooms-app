const chai = require('chai');
const chaiHttp = require('chai-http');

const {server, app} = require('../server');

const should = chai.should();


chai.use(chaiHttp);

describe('index page', function() {
	it('index exists', function() {
		return chai.request(app)
		.get('/index.html')
		.end(function(err, res) {
			res.should.have.status(200);
			res.should.be.html;
		});
	});
});

describe('index page', function() {
	it('about exists', function() {
		return chai.request(app)
		.get('/about.html')
		.end(function(err, res) {
			res.should.have.status(200);
			res.should.be.html;
		});
	});
});

describe('index page', function() {
	it('input exists', function() {
		return chai.request(app)
		.get('/input.html')
		.end(function(err, res) {
			res.should.have.status(200);
			res.should.be.html;
		});
	});
});

describe('index page', function() {
	it('results exists', function() {
		return chai.request(app)
		.get('/index.html')
		.end(function(err, res) {
			res.should.have.status(200);
			res.should.be.html;
		});
	});
}); 