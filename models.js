let mongoose = require('mongoose');
let bcrypt = require('becryptjs');
let Schema = mongoose.Schema;

let TipsSchema = Schema({
  username: {type: String, required: true, default: 'Bob Saget'},
  body: {type: String, required: true},
  date: {type: Date, default: Date.now()},
  tags: Array,
  points: {type: Number, default: 0}
});
//TODO: Add in Moment and a virtual to replace ugly JS dates with awesome formatted dates
TipsSchema.virtual('date').get(function() {
  this.date = moment().format('MMMM Do YYYY, h:mm a');
  return this.date;
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

UserSchema.methods.validatePassword = function(password) {
  return bcrypt 
    .compare(password, this.password)
    .then(isValid => isValid);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt 
    .hash(password, 10)
    .then(hash => hash);
};

let Tips = mongoose.model('Tip', TipsSchema);
let User = mongoose.model('User', UserSchema);

module.exports = {Tips, User};
