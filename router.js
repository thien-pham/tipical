let mongoose = require('mongoose');
//let bodyParser = require('body-parser');
let {Tips} = require('./models');
mongoose.Promise = global.Promise;
module.exports = (app)=>{
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());

  app.get('/', (req,res) => {
      Tips.find().then((data) => {
        res.render('index', {val: data});
      }).catch(err => console.error(err));
      return res.body;
  });

  app.post('/posts', (req, res)=>{
    console.log(req.body);
    let data = new Tips(req.body);
    data.save().then(() => 
      res.status(201).end())
      .catch(err => { 
        res.status(400).end();
        console.error(err);
      });
  });

  app.put('/posts/:id', (req, res) => {
    Tips
      .findByIdAndUpdate(req.params.id, {$set: req.body})
      .then((result) => res.status(204).end())
      .catch(err => res.status(500).json({message: 'Internal server error on put'}));
  });

  app.delete('/posts/:id', (req, res) => {
    Tips 
      .findByIdAndRemove(req.params.id)
      .then((result) => res.status(204).end())
      .catch(err => res.status(500).json({message: 'Internal server error on delete'}));
  });
};

