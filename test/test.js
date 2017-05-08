const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');

const should = chai.should();
chai.use(chaiHttp);

describe('\trun page\n', function() {
    it('GET endpoint', function() {
        return chai.request(app)
            .get('/')
            .then(function(res) {
                res.should.have.status(200);     
                res.text.should.be.string;
            });
    }); 
});


