const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {Tips, User} = require('../models');
const {app,startServer,stopServer} = require('../server.js');

const should = chai.should();
chai.use(chaiHttp);

let testUser = ()=>{return User.hashPassword('123').then((hashed)=>{
    console.log('hashed is ' + hashed);
    return {
    username: 'Joe',
    password: hashed,
    unhashedPW: '123'
};});};

// let testUser = {
//     username: 'JOE',
//     password: User.hashPassword('123')
// };
    

function makeFakeData(){
  let data = [];
  let number = 5;
  for(let i =0;i<=number;i++){
    console.log('running!  Iteration ' + i);
    data.push({
      username: faker.internet.userName(),
      body: faker.lorem.paragraph()
    });
    //console.dir(data);
  }
  return Tips.insertMany(data);
}

function makeFakeUser(){
    return User.create(testUser);
}

// function tearDownDb(){
//     Tips.remove({}, () => console.log('It works!'))
//         .then(() => User.remove({}, () => console.log('It works, the sequel!')));
// }

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}

describe('Run the tests!\n',function(){

  before(()=>{
    return startServer();
  });

  beforeEach(function(){
    return Promise.all([makeFakeUser(), makeFakeData()]);
  });
  
//   afterEach(function(){
//       tearDownDb();
//   });

  after(()=>stopServer());

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

  describe('\tDo post stuff.',() => {
      it('Post endpoint', () => {
          const post = {
              username: faker.internet.userName(),
              body: faker.lorem.paragraph()
          };
          return chai.request(app)
              .post('/posts')
              .auth(testUser.username, testUser.password)
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

  describe('\tDo put stuff', () => {
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

  describe('\tDo delete stuff', () => {
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

});
