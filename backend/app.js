const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nunjucks = require('nunjucks')
const mongoose = require('mongoose')
require('dotenv').config()

var indexRouter = require('./routes/index');
var historyRouter = require('./routes/history');
var newRouter = require('./routes/new');
var itemsRouter = require('./routes/items');
var copyRouter = require('./routes/copy');
var collectRouter = require('./routes/collect');

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

app.use('/', indexRouter);
app.use('/history', historyRouter);
app.use('/new', newRouter)
app.use('/items', itemsRouter)
app.use('/', copyRouter);
app.use('/collect', collectRouter);
module.exports = app;
