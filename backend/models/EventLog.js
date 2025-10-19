const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema({
  action: String,
  details: Object,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventLog', eventLogSchema);