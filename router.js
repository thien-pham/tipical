let mongoose = require('mongoose');
let {Tips, User} = require('./models');
let passport = require('passport');
let {BasicStrategy} = require('passport-http');

mongoose.Promise = global.Promise;

const strategy = new BasicStrategy(function(username, password, callback) {
  let user;
  User
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, {message: 'Incorrect username'});
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, {message: 'Incorrect password'});
      }
      else {
        return callback(null, user);
      }
    });
});

passport.use(strategy);
module.exports = (app)=>{
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());

  app.get('/', (req,res) => {
      Tips.find().then((data) => {
        res.render('index', {val: data});
      }).catch(err => console.error(err));
      return res.body;
  });

  app.post('/posts', 
    passport.authenticate('basic', {session:false}), (req, res)=>{
    console.log(req.body);
    let data = new Tips(req.body);
    data.save().then(() =>
      res.status(201).end())
      .catch(err => {
        res.status(400).end();
        console.error(err);
      });
  });
  
  app.post('/users', (req, res) => {
    // let {username, password} = req.body;

    return User
      .find({username: req.body.username})
      .count()
      .exec()
      .then(count => {
        if (count > 0) {
          return res.status(422).json({message: 'username already taken'});
        }
        return User.hashPassword(req.body.password);
      })
      .then(hash => {
        return User
          .create({
            username: req.body.username,
            password: hash
      })
      .then(user => {
        return res.status(201).json(user);
      })
      .catch(err => {
        res.status(500).json({message: 'something went terribly awry'});
      });
  });
  });

  app.put('/posts/:id', 
    passport.authenticate('basic', {session:false}), (req, res) => {
    Tips
      .findByIdAndUpdate(req.params.id, {$set: req.body})
      .then(() => res.status(204).end())
      .catch(() => res.status(500).json({message: 'Internal server error on put'}));
  });

  app.delete('/posts/:id', 
    passport.authenticate('basic', {session:false}), (req, res) => {
    Tips
      .findByIdAndRemove(req.params.id)
      .then(() => res.status(204).end())
      .catch(() => res.status(500).json({message: 'Internal server error on delete'}));
  });
  };
