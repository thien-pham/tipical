const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {Tips, User} = require('../models');
const {app,startServer,stopServer} = require('../server.js');

const should = chai.should();
chai.use(chaiHttp);

let testUser = {
    username: faker.internet.userName(),
    password: '$2a$10$i8D0JeiwLwl1QXqN7DSkyujGw4u9l65X8xA9TmY26TJCoeJ3QqEZK',
    unhashedPassword: '123'
};

function makeFakeData(){
  let data = [];
  for(let i=0; i<=5; i++){
    data.push({
      body: faker.lorem.paragraph()
    });
  }
  return Tips.insertMany(data);
}

function makeFakeUser(){
    return User.create(testUser);
}

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

describe('Run the tests!\n',function(){

  before(()=>{
    return startServer();
  });

  beforeEach(function(){
    return Promise.all([makeFakeUser(), makeFakeData()]);
  });

  afterEach(function(){
    return tearDownDb();
  });

  after(()=> {
    return stopServer();
  });

  describe('\trun page\n', function() {
      it('GET endpoint', function() {
          return chai.request(app)
              .get('/')
              .then(function(res) {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
              }).catch(function(err){throw err;});
      });
  });

  describe('\tDo post stuff.',() => {
      it('Post endpoint', () => {
          const newPost = {
              body: faker.lorem.paragraph(),
              location: [faker.address.latitude(),faker.address.longitude()]
          };
          return chai.request(app)
              .post('/posts')
              .auth(testUser.username, testUser.unhashedPassword)
              .send(newPost)
              .then((result)=>{
                  result.should.have.status(201);
                  result.should.be.a('object');
              }).catch(function (err) {
              throw err;
          });
      });
  });

  describe('\tDo put stuff', () => {
      it('PUT endpoint', () => {
          const updatedPost = {
              body: faker.lorem.paragraph()
          };

          let oldPost;
          return Tips
              .findOne()
              .exec()
              .then(_oldPost => {
                  oldPost = _oldPost;
                  updatedPost.id = oldPost.id;

                  return chai.request(app)
                      .put(`/posts/${oldPost.id}`)
                      .auth(testUser.username, testUser.unhashedPassword)
                      .send(updatedPost);
              })
              .then(res => {
                  res.should.have.status(204);
              });
      });
  });//mongodb://foo:bar@ds129031.mlab.com:29031/test1

  describe('\tDo delete stuff', () => {
      it('DELETE endpoint', () => {
          let post;
          return Tips
              .findOne()
              .exec()
              .then(_post => {
                  post = _post;
                  return chai.request(app)
                      .delete(`/posts/${post.id}`)
                      .auth(testUser.username, testUser.unhashedPassword);
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

});
