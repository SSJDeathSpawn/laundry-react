const express = require('express');
const models = require('./models');
var router = express.Router();

router.get('/submit', (req, res, next) => {
  models.SubmitItem.find({}).then(items => {
    res.render('submititems', {items: items});
  });
});

router.get('/collect', (req, res, next) => {
  models.CollectItem.find({}).then(items => {
    res.render('collectitems', {items: items});
  });
});

module.exports = router
