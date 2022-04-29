const mongoose = require("mongoose");

const format = {
  discord_id : Number,
  nft_wallets : Array,
  eth_wallets : Array,
  channel_ids : Array,
  message_ids : Array,
};

module.exports = mongoose.model('configRecords', format);