let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TipsSchema = Schema({
  username: {type: String, required: true, default: "Bob Saget"},
  body: {type: String, required: true},
  date: {type: Date, default: Date.now()},
  tags: Array,
  points: {type: Number, default: 0}
});

//TODO: Add in Moment and a virtual to replace ugly JS dates with awesome formatted dates

let Tips = mongoose.model("Tip",TipsSchema);
module.exports = {Tips};
