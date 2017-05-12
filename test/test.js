const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {Tips, User} = require('../models');
const {app,startServer,stopServer} = require('../server.js');
const {DATABASE, PORT, TESTDATABASE} = require('../config');

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
      body: faker.lorem.paragraph(),
      username: testUser.username
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
    return startServer(TESTDATABASE);
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
                  res.body.forEach((val)=>{
                    val.should.have.ownProperty('username','body','location','date','tags', 'points');
                    val.should.be.a('object');
                  });

                  return Tips.count();
              })
              .then(count => {
                  res.body.should.have.length.of(count);
              }).catch(function(err){throw err;});
      });

      it('Should return all posts by a specific user.',function(){
        return chai.request(app)
          .get('/user_posts')
          .auth(testUser.username, testUser.unhashedPassword)
          .then((res) =>{
            res.should.have.status(200);
            return res.body;
          }).then((val)=>{
            val.should.have.length.of.at.least(1);
            val.forEach((val)=>{
              val.should.have.ownProperty("body",'username','points','tags','date');
            });
          });
      });


      it('Should return a specific post.',function(){
        return Tips.findOne().then((val)=>{
          console.log(val._id);
          return chai.request(app)
            .get(`/find_post/${val._id}`)
            .auth(testUser.username, testUser.unhashedPassword)
            .then((res) =>{
              res.should.have.status(200);
              return res.body;
            }).then((val)=>{
              val.should.have.ownProperty("body",'username','points','tags','date');
            });
        });
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
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.ownProperty('username', 'body', 'date', 'location');

                  return res.body;
                }).then((res)=>{
                  let id = new mongoose.Types.ObjectId(res._id);
                  return Tips.findById(id).exec();
              }).then((val)=>{
                val.username.should.equal(newPost.username);
                val.body.should.equal(newPost.body);
                should.exist(val.location[0]);
                should.exist(val.location[1]);
              }).catch(function (err) {
              throw err;
          });
      });
  });


  describe('\tPOST user create endpoint\n', () => {
      it('should add a new user', () => {

          const newUser = {
              "username": faker.internet.userName(),
              "password": faker.internet.password(),

          };
          return chai.request(app)
              .post('/users')
              .send(newUser)
              .then((res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.ownProperty('username', 'password');

                  return res.body;
                }).then((res)=>{
                  let id = new mongoose.Types.ObjectId(res._id);
                  return User.findById(id).exec();
              }).then((val)=>{
                val.username.should.equal(newUser.username);
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
                  res.should.have.status(200);
                  //let id = new mongoose.Types.ObjectId();
                  return Tips.findById(oldPost._id).exec();
              }).then((val)=>{
                val.body.should.equal(updatedPost.body);
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
