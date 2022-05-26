const Discord = require('discord.js');
const config_records = require('../models/configRecords');
const sub_records = require('../models/subscriptionRecords');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log("!!!!! BOBOT IS ON !!!!!");
    async function configFilter() {
      const subs = await sub_records.find();
      subs.forEach(async (sub) => {
        const end_timestamp = sub.end_timestamp;
        if (Date.now() < end_timestamp) return;
        await sub_records.deleteOne({
          discord_id: sub.discord_id,
        }).catch((e) => {
          console.log(e);
        });
        await config_records.deleteOne({
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