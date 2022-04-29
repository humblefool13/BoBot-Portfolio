const mongoose = require("mongoose");

const format = {
  discord_id : Number,
};

module.exports = mongoose.model('freeTrials', format);