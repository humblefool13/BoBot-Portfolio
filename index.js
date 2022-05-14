const {
  Client,
  Collection,
  Intents
} = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS]
});

client.interactions = new Collection();

require('./handlers/events')(client);
require('./handlers/interactions')(client);

require('./databases/freeTrials')();
require('./databases/configRecords')();
require('./databases/subscriptionRecords')();

client.login(process.env['bot_token-test']);