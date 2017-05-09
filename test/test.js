const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const faker = require('faker');
const {Tips} = require('../models');

const should = chai.should();
chai.use(chaiHttp);

describe('\trun page\n', function() {
    it('GET endpoint', function() {
        return chai.request(app)
            .get('/')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.html;
            }).catch(function(err){throw err;});
    });
});

describe('Do post stuff.',() => {
    it('Post endpoint', () => {
        const post = {
            username: faker.internet.userName(),
            body: faker.lorem.paragraph()
        };
        return chai.request(app)
            .post('/posts')
            .send(post)
            .then((result)=>{
                console.log('value of result:');
                console.log(result.body);
                result.body.should.be.a('Object');
            }).catch(function (err) {
            throw err;
        });
    });
});

describe('Do put stuff', () => {
    it('PUT endpoint', () => {
        const updatedPost = {
            username: faker.internet.userName(),
            body: faker.lorem.paragraph()
        };
        
        return Tips
            .findOne()
            .exec()
            .then(post => {
                updatedPost.id = post.id;
             
                return chai.request(app)
                    .put(`/posts/${post.id}`)
                    .send(updatedPost);
            })
            .then(res => {
                res.should.have.status(204);
            });
    });
});

describe('Do delete stuff', () => {
    it('DELETE endpoint', () => {
        let post;
        return Tips
            .findOne()
            .exec()
            .then(_post => {
                post = _post;
                return chai.request(app)
                    .delete(`/posts/${post.id}`);
            })
            .then(res => {
                res.should.have.status(204);
                return Tips.findById(post.id);
            })
            .then(_post => {
                should.not.exist(_post);
            });
    });
}); 