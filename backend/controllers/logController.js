const EventLog = require("../models/EventLog");

exports.getLogs = async (req, res) => {
  try {
    const logs = await EventLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
