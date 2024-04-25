const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks')
const mongoose = require('mongoose')
const logger = require('morgan');
require('dotenv').config();

var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');

mongoose.connect(process.env.MONGODB_URL, {
  dbName: 'laundry'
});
var app = express();
nunjucks.configure('views', {
  autoescape: true,
  express: app
})
app.set('view engine', 'html')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);
app.use('/', adminRouter);

module.exports = app;
