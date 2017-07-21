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