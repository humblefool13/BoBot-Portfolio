const mongoose = require("mongoose");

const format = {
  discord_id: String,
  start_timestamp: Number,
  weeks: Number,
  end_timestamp: Number,
};

module.exports = mongoose.model('subscriptionRecords', format);