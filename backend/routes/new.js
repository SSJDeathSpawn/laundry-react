const express = require('express');
const models = require('./models');
var router = express.Router();

/* GET new page */
router.get('/', function(req, res, next) {
  res.render('new');
});

router.post('/', function(req, res, next) {
  console.log(req.query)
  console.log(req.body)
  switch (req.query.op) {
    case 'new':
      models.SubmitItem.exists({ name: 'cloth' }).then(result => {
        if (result == null) {
          let item = models.SubmitItem();
          item.amt = 1;
          item.name = 'cloth';
          item.save().then(_ => {
            models.SubmitItem.find({}).then(items => {
              console.log(items)
              res.render('submititems', { items: items });
            })
          });
        } else {
          res.status(409).send("Cloth type already exists")
          return;
        }
      }).catch(err => res.status(404).send(err));
      break;
    case 'increment':
      models.SubmitItem.findOne({ name: Object.keys(req.body)[0] }).then(item => {
        item.amt += 1;
        item.save().then(_ => {
          models.SubmitItem.find({}).then(items => {
            console.log(items)
            res.render('submititems', { items: items });
          })
        });
      }).catch(err => res.status(404).send(err));
      break;
    case 'decrement':
      models.SubmitItem.findOne({ name: Object.keys(req.body)[0] }).then(item => {
        if (item.amt == 1) {
          models.SubmitItem.findOneAndDelete({ name: item.name, amt: item.amt }).exec().then(_ => {
            models.SubmitItem.find({}).then(items => {
              console.log(items)
              res.render('submititems', { items: items });
            })
          });
        } else {
          item.amt -= 1;
          item.save().then(_ => {
            models.SubmitItem.find({}).then(items => {
              console.log(items)
              res.render('submititems', { items: items });
            })
          });
        }
      }).catch(err => { console.log(err); res.status(404).send(err) });
      break;
    case 'change':
      if (Object.values(req.body)[0] === "") {
        models.SubmitItem.find({}).then(items => {
          console.log(items)
          res.render('submititems', { items: items });
        })
        return;
      }
      models.SubmitItem.findOne({ name: Object.values(req.body)[0] }).then(result => {
        if (result != null) {
          res.status(409).send("Cloth type already exists")
          return;
        }
        models.SubmitItem.findOne({ name: Object.keys(req.body)[0] }).then(item => {
          item.name = Object.values(req.body)[0]
          item.save().then(_ => {
            models.SubmitItem.find({}).then(items => {
              console.log(items)
              res.render('submititems', { items: items });
            })
          });
        }).catch(err => res.status(404).send(err));
      });
      break;
    default:
      res.sendStatus(403);
      return;
  }
});

router.post('/submit', (req, res, next) => {
  models.CollectItem.find({}).then(collect => {
    if (collect.length != 0) {
      console.log(collect);
      res.status(409).send('Collect the current clothes <br> before submitting new ones.');
      return;
    }
    models.SubmitItem.find({}).then(items => {
      let history = new models.History();
      const total = items.map(item => { return item.amt; }).reduce((a, b) => { return a + b; });
      history.total = total;
      const date = new Date().setHours(0, 0, 0, 0);
      history.date = date
      history.clothes = items.map((item) => item.name);
      history.amts = items.map((item) => item.amt);
      history.save();

      items.forEach(item => {
        let collect = new models.CollectItem();
        collect.total_amt = item.amt;
        collect.count = item.amt;
        collect.name = item.name;
        collect.save();
      });

      models.SubmitItem.deleteMany({}).then(_ => {
        res.render('submititems', {items: []});
      });
    }).catch(err => res.send(err));
  });
});

module.exports = router
