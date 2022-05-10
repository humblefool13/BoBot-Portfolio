const Discord = require('discord.js');
const config_records = require('../models/configRecords');
const sub_records = require('../models/subscriptionRecords');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log("Bot is on");
    async function configFilter() {
      const subs = await sub_records.find();
      const configs = await config_records.find();
      subs.forEach(async (sub) => {
        const end_timestamp = sub.end_timestamp;
        if (Date.now() < end_timestamp) return;
        await subs.deleteOne({
          discord_id: sub.discord_id,
        }).catch((e) => {
          console.log(e);
        });
        await configs.deleteOne({
          discord_id: sub.discord_id,
        }).catch((e) => {
          console.log(e);
        });
      });
    };
    configFilter();
    setInterval(configFilter, 1000 * 60 * 10);
  },
};