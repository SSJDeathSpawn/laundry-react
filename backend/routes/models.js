const mongoose = require('mongoose');

models = {}

models.History = mongoose.model('history', new mongoose.Schema({
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  clothes: {
    type: [String],
    required: true
  },
  amts: {
    type: [Number],
    required: true
  }
}), 'history');

models.SubmitItem = mongoose.model('submit', new mongoose.Schema({
  amt: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}));

models.CollectItem = mongoose.model('collect', new mongoose.Schema({
  total_amt: {
    type: Number,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}));

module.exports = models
