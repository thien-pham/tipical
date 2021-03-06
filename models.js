let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let moment = require('moment');
let Schema = mongoose.Schema;

let TipsSchema = Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
  date: {type: Date, default: Date.now()},
  // location: { type: { type: String }, coordinates: [Number] },
  location:{ type: [Number], index: '2dsphere',},
  points: {type: Array, default: []}
});

// TipsSchema.index({location: '2dsphere'})

TipsSchema.virtual('postDate').get(function() {
  let date = moment(this.date).format('MM Do YYYY');
  return date;
});

let UserSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

let Tips = mongoose.model('Tip', TipsSchema);
let User = mongoose.model('User', UserSchema);

module.exports = {Tips, User};
