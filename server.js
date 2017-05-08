const express = require('express');
require('dotenv');
const app = express();


app.use(express.static('public'));

app.get('/',(req,res)=>{
    return res.body;
});


app.listen(process.env.PORT, () => console.log('app is listening'));

module.exports = app;