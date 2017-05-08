const express = require('express');
const mongoose = require('mongoose');
const {DATABASE, PORT} = require('./config');

const app = express();

app.use(express.static('public'));

app.get('/',(req,res)=>{
    return res.body;
});


app.listen(PORT || 8080, () => {
    console.log('app is listening');
    mongoose.connect(DATABASE);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => console.log('connected to database'));
});

module.exports = app;