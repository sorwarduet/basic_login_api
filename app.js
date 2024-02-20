const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const connectDB=require("./src/config/connectDB");

connectDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router=require('./src/routes/api');

app.use('/api/v1',router);
app.get('*',(req,res)=>{
    res.status(404).send('Page Not Found');
})


module.exports = app;

