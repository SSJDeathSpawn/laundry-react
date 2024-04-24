var express = require('express');
const models = require('./models');
var router = express.Router();


router.get('/copy', (req, res, next) => {
  models.SubmitItem.find({}).then((items) => {
    console.log(items);
    const total = items.map(item => {return item.amt;}).reduce((a, b) => {return a+b;});
    const formatted_items = items.map(item => `${item.amt} ${item.name}`).join(', ');
    const result = `${total} total, ${formatted_items}`;
    console.log(result);
    res.send(result);
  });
});

module.exports = router
