const express = require('express');
const models = require('./models');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  models.History.find({}).then(history => {
    res.render('history', {history: history});
  });
});

router.get('/:date', function(req, res, next) {
  console.log(req.params.date);
  const zip = (a, b) => a.map((k, i) => [k, b[i]]);
  models.History.findOne({date: req.params.date}).then(item => {
    const item_count = zip(item.clothes, item.amts)
    const items = item_count.map(pair => {
      return `${pair[0]} ${pair[1]}`
    });
    const text = items.join(', ');
    const final_text = `${item.total} total, ` + text;
    res.send(final_text)
  });
});

module.exports = router;
