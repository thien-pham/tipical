let mongoose = require('mongoose');
//let bodyParser = require('body-parser');
let {Tips} = require('./models');
mongoose.Promise = global.Promise;
module.exports = (app)=>{
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());

  app.get('/',(req,res)=>{
      Tips.find().then((data)=>{
        res.render('index',{val: data});
      });
      return res.body;
  });

  app.post('/posts',(req,res)=>{
    console.log(req.body);
    let data = new Tips(req.body);
    data.save();
    res.status(201).end();
  });
};
