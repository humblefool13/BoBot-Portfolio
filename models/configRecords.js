const mongoose = require("mongoose");

const format = {
  discord_id: String,
  guild_id: String,
  dm: Boolean,
  nft_wallets: Array,
  wallets: Array,
  channel_ids: Array,
  message_ids: Array,
};

module.exports = mongoose.model('configRecords', format);