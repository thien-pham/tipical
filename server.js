const express = require('express');
const mongoose = require('mongoose');
const {DATABASE, PORT} = require('./config');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
const app = express();

require("./router")(app);
app.set("view engine", "ejs");

app.use(bodyParser);
app.use(express.static('views'));

app.listen(PORT || 8080, () => {
    console.log('app is listening');
    mongoose.connect(DATABASE);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => console.log('connected to database'));
});

module.exports = app;
