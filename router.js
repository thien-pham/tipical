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

//the closure for the module exporting
module.exports = (app)=>{
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());

  //GET ENDPOINTS-------------------------------------------------------
  //get all tips
  app.get('/', (req,res) => {
      if(req.query.lat !== undefined && req.query.lon !== undefined){
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        Tips.find({
          location: {
            $near: {
              $geometry: {
                type: 'point',
                coordinates: [lat,lon]
              },
              //in meters
              $maxDistance:500000
            }
          }
        }).then((data) => {
          res.status(200).send(data);
        }).catch(err => console.error(err));
        return res.body;
      }
      Tips.find().then((data) => {
        res.status(200).send(data);
      }).catch(err => console.error(err));
      return res.body;
  });

  //Find all posts by a user
  app.get('/user_posts',passport.authenticate('basic',{session:false}), (req,res)=>{
    Tips.find({username: req.user.username}).then((val)=>{
      console.log(val);
      res.status(200).send(val);
    });
  });

  //find an individual post
  app.get('/find_post/:id',passport.authenticate('basic',{session:false}), (req,res)=>{
    Tips.findById(req.params.id).then((val)=>{
      res.send(val);
    });
  });

  //For client-side logging in info.  Ping it and if valid, returns true
  app.get('/users',passport.authenticate('basic',{session:false}),(req,res)=>{

    res.send(req.user.username).end();
  });

  //voting endpoint
  app.get('/posts/vote/:id', passport.authenticate('basic', {session:false}), (req,res)=>{
    Tips.findById(req.params.id).then((tip)=>{
      if(tip && !(tip.points.includes(req.user.username))){
        tip.points.push(req.user.username);
        Tips.findByIdAndUpdate(req.params.id,{$set: tip})
        .then(()=>res.status(204).end())
        .catch(()=>res.status(500).json({message: 'there was a problem with the server on vote.'}));
      }else{
        res.status(403).json({message: "You already voted, cheater!"});
      }
    });
  });

  //POST ENDPOINTS-------------------------------------------------------
  //create post endpoint
  app.post('/posts',
    passport.authenticate('basic', {session:false}), (req, res)=>{
    console.log(req.body);
    let data = new Tips(req.body);
    data.save().then((val) => {
      console.log(val);
      res.status(201).send(val);})
      .catch(err => {
        res.status(400).end();
        console.error(err);
      });
  });

  //Create user endpoint
  app.post('/users', (req, res) => {
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
      .catch(() => {
        res.status(500).json({message: 'something went terribly awry'});
      });
    });
  });

  //UPDATE ENDPOINTS-------------------------------------------------------
  //update user endpoint
  app.put('/posts/:id',
    passport.authenticate('basic', {session:false}), (req, res) => {
    Tips
      .findByIdAndUpdate(req.params.id, {$set: req.body})
      .then(() => res.location(`/find_post/${req.params.id}`).status(200).end())
      .catch(() => res.status(500).json({message: 'Internal server error on put'}));
  });
  //DELETE ENDPOINTS-------------------------------------------------------
  app.delete('/posts/:id',
    passport.authenticate('basic', {session:false}), (req, res) => {
    Tips
      .findByIdAndRemove(req.params.id)
      .then(() => res.status(204).end())
      .catch(() => res.status(500).json({message: 'Internal server error on delete'}));
  });
};
