const config_records = require('../models/configRecords');
const sub_records = require('../models/subscriptionRecords');
const { ActivityType } = require("discord.js");

async function editEndMsg(config, client) {
  const dm = config.dm;
  if (dm) {
    const user = await client.users.fetch(config.discord_id);
    const channel = await user.createDM([true]);
    const messages = config.message_ids;
    for (i = 0; i <= 3; i++) {
      const message = await channel.messages.fetch(messages[i]);
      await message.edit({
        content: ".",
        components: [],
        embeds: [],
      }).catch((e) => { });
    };
    const portFolioMsg = await channel.messages.fetch(messages[2]);
    await portFolioMsg.edit({
      content: "Your subscription has ended . Please contact us in our support server to renew it in order to continue using the services !\nThank you."
    }).catch((e) => { });
  } else {
    const channels = config.channel_ids;
    const messages = config.message_ids;
    for (i = 0; i <= 3; i++) {
      const channel = await client.channels.fetch(channels[i]).catch((e) => { });
      if (channel) {
        const message = await channel.messages.fetch(messages[i]).catch((e) => { });
        if (message) {
          message.edit({
            content: "Your subscription has ended . Please contact us in our support server to renew it in order to continue using the services !\nThank you.",
            components: [],
            embeds: [],
          }).catch((e) => { });
        };
      };
    };
  };
};

async function handleRoles(subscribers, client) {
  const guild = client.guilds.cache.get("969155191339384892");
  const members = await guild.members.fetch();
  members.each((m) => {
    const id = m.id;
    if (m.roles.cache.has("983243599691005993") && !subscribers.includes(id)) return m.roles.remove("983243599691005993");
    if (!m.roles.cache.has("983243599691005993") && subscribers.includes(id)) return m.roles.add("983243599691005993");
  });
};

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    client.user.setStatus('online');
    const guildsCount = client.guilds.cache.size;
    console.log(`!!!!! ${client.user.id} IS ON !!!!!`);
    async function configFilter() {
      const subs = await sub_records.find();
      const subscriberCount = subs.length;
      client.user.setActivity(`${subscriberCount} Portfolios | ${guildsCount} Servers`, { type: ActivityType.Watching });
      const subscribers = subs.map(e => e.discord_id);
      handleRoles(subscribers, client);
      subs.forEach(async (sub) => {
        const end_timestamp = sub.end_timestamp;
        if (Date.now() < end_timestamp) return;
        await sub_records.deleteOne({
          discord_id: sub.discord_id,
        }).catch((e) => {
          console.log(e);
        });
        const config = await config_records.findOne({
          discord_id: sub.discord_id,
        }).catch((e) => {
          console.log(e);
        });
        if (config) editEndMsg(config, client).catch((e) => { });
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