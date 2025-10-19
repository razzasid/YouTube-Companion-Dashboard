const EventLog = require("../models/EventLog");

async function logEvent(action, details) {
  try {
    await EventLog.create({ action, details });
  } catch (err) {
    console.error("Failed to log event:", err);
  }
}

module.exports = { logEvent };
