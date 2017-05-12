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

  describe('\tGET endpoint\n', () => {
      it('should return all existing tips', () => {
          let res;
          return chai.request(app)
              .get('/')
              .then((_res) => {
                  res = _res;
                  res.should.have.status(200);
                  res.body.should.have.length.of.at.least(1);
                  res.body.should.be.a('array');

                  return Tips.count();
              })
              .then(count => {
                  res.body.should.have.length.of(count);
              }).catch(function(err){throw err;});
      });
  });

  describe('\tPOST endpoint\n', () => {
      it('should add a new tip', () => {

          const newPost = {
              "username": faker.internet.userName(),
              "body": faker.lorem.paragraph(),
              "location": [faker.address.latitude(),faker.address.longitude()]
          };
          return chai.request(app)
              .post('/posts')
              .auth(testUser.username, testUser.unhashedPassword)
              .send(newPost)
              .then((res) => {
                  console.log("\n\n\tYOU ARE HERE!");
                  console.log(testUser);
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.ownProperty('username', 'body', 'date', 'location');
                
                  return Tips.findById(res.id).exec();
              }).catch(function (err) {
              throw err;
          });
      });
  });

  describe('\tPUT endpoint', () => {
      it('should update fields sent over', () => {
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
                  return Tips.findById(res.id).exec();
              });
      });
  });

  //mongodb://foo:bar@ds129031.mlab.com:29031/test1

  describe('\tDELETE endpoint', () => {
      it('should delete a post by id', () => {
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
