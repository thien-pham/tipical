const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const faker = require('faker');

const should = chai.should();
chai.use(chaiHttp);

describe('\trun page\n', function() {
    it('GET endpoint', function() {
        return chai.request(app)
            .get('/')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.html;
            });
    });
});
describe("Do post stuff.",()=>{
    it("Post endpoint", () => {
        const post = {
            username: faker.internet.userName(),
            body: faker.lorem.paragraph()
        };
        return chai.request(app)
        .post("/posts")
        .send(post)
        .then((result)=>{
            console.log("value of result:");
            console.log(result.body);
            result.body.should.be.a('Object');
        }).catch(function (err) {
          throw err;
        });
    });
});
