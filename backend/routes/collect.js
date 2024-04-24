const express = require('express');
const models = require('./models');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('collect');
});

router.post('/', function(req, res, next) {
  console.log(req.query)
  switch (req.query.op) {
    case 'decrement':
      models.CollectItem.findOne({ name: req.body.name }).then(item => {
        if (item == null) {
          res.status(404).send("Not found");
          return;
        }
        if (item.count > 0) {
          console.log(item)
          item.count -= 1;
          item.save().then(_ => {
            models.CollectItem.find({}).then(items => {
              res.render('collectitems', { items: items })
            });
          });
        }
      });
      break;
    case 'reset':
      models.CollectItem.findOne({ name: req.body.name }).then(item => {
        if (item == null) {
          res.status(404).send("Not found");
          return;
        }
        item.count = item.total_amt;
        item.save().then(_ => {
          models.CollectItem.find({}).then(items => {
            res.render('collectitems', { items: items })
          });
        });
      });
      break;
    default:
      res.sendStatus(403);
      return;
  }
});

router.post('/finish', function(req, res, next) {
  models.CollectItem.deleteMany({}).then(_ => {
    res.render('collectitems', {items: []});
  });
});

module.exports = router;
