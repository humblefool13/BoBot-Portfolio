const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");
const options = { method: 'GET', headers: { Accept: 'application/json', "X-API-KEY": process.env['os_key'] } };
const row_left = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId("left")
      .setLabel("❰")
      .setStyle("PRIMARY")
      .setDisabled(true),
    new MessageButton()
      .setCustomId("right")
      .setLabel("❱")
      .setStyle("PRIMARY")
  );
const row_middle = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId("left")
      .setLabel("❰")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId("right")
      .setLabel("❱")
      .setStyle("PRIMARY")
  );
const row_right = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId("left")
      .setLabel("❰")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId("right")
      .setLabel("❱")
      .setStyle("PRIMARY")
      .setDisabled(true)
  );
const row = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setLabel("🔄")
      .setStyle("SUCCESS")
      .setCustomId("refresh")
  );
const mongoose = require("mongoose");
const {
  RateLimiter
} = require("limiter");
const config_records = require('../models/configRecords');
const sub_records = require('../models/subscriptionRecords');
let etherscan_key = process.env['etherscan_key'];
etherscan_key = etherscan_key.split(",");
let eklength = etherscan_key.length;
let ekv = 0;
const fetch = require("node-fetch");
const limiter_OS = new RateLimiter({
  tokensPerInterval: 4,
  interval: "second",
  fireImmediately: true
});
const limiter_eth = new RateLimiter({
  tokensPerInterval: 5 * eklength,
  interval: "second",
  fireImmediately: true
});
const limiter_cv = new RateLimiter({
  tokensPerInterval: 5,
  interval: "second",
  fireImmediately: true
});
const permittedContracts = ["0x6b175474e89094c44da98b954eedeac495271d0f", "0xdac17f958d2ee523a2206206994597c13d831ec7", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0x4fabb145d64652a948d72533023f6e7a623c7c53", "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce", "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", "0x514910771af9ca656af840dff83e8264ecf986ca", "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", "0x0f5d2fb29fb7d3cfee444a200298f468908cc942", "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9", "0x3845badade8e6dff049820680d1f14bd3903a5d0", "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b", "0x15d4c048f83bd7e37d49ea4c83a07267ec4203da", "0xf4d2888d29d722226fafa5d9b24f9164c092421e", "0x94e496474f1725f1c1824cb5bdb92d7691a4f03a", "0x4d224452801aced8b2f0aebe155379bb5d594381", "0xb8c77482e45f1f44de1745f52c74426c631bdd52"];

// DAI USDT USDC WETH BUSD WBTC SHIBAINU UNISWAP CHAINLINK MATIC MANA AAVE SAND AXIEINFINITY GALA LOOKS BANANA APECOIN BNB

////////////// SYNC FUNCTIONS //////////////

function embedGenerator(title, url, description) {
  const returnEmbed = new MessageEmbed().setColor("#454be9").setTitle(title).setDescription(description);
  if (url) returnEmbed.setURL(url);
  return returnEmbed;
};
function descriptionGenerator(array) {
  let floorString = "\`\`\`Quantity - Name - Floor [ETH] - Floor [USD] - TOTAL\n";
  array.forEach((collection) => {
    floorString = floorString + `\n` + collection.join(" - ");
  });
  floorString = floorString + "\`\`\`";
  return floorString;
};
function arraySplitter(array, number) {
  let resultArray = [];
  for (i = 0; i < number; i++) {
    resultArray.push(array.slice(Math.floor(i * array.length / number), Math.floor((i + 1) * array.length / number)));
  };
  return resultArray;
};
function walletDescriptionGenerator(walletsData) {
  let descriptionString = "";
  walletsData.forEach((walletData) => {
    descriptionString = descriptionString + `:white_medium_small_square: **WALLET ADDRESS** -\n **[${walletData[0]}](https://etherscan.io/address/${walletData[0]} "Click to view the wallet on etherscan")**\n:white_small_square: ETH HELD : Ξ ${walletData[1]}\n:white_small_square: ETH HELD [USD WORTH] : $ ${walletData[2]}\n\n`;
  });
  return descriptionString;
};
function liquidCalculator(arr) {
  let liquidTotal = 0;
  arr.forEach((ar) => {
    liquidTotal = Number(liquidTotal) + Number(ar[1]);
  });
  return liquidTotal;
};
function ercProcess(arr) {
  let arrFinal = [];
  arr.forEach((balances) => {
    balances.forEach((e) => {
      if (Number(e[3]) === 0) return;
      if (e[0] === "Ether") return;
      const symbol = e[1];
      const find = arrFinal.find((el) => el[1] === symbol);
      if (!find) {
        arrFinal.push(e);
      } else {
        const index = arrFinal.indexOf(find);
        const newBalance = Number(find[3]) + Number(e[3]);
        const newWorth = Number(find[4]) + Number(e[4]);
        arrFinal[index] = [e[0], e[1], e[2], newBalance, newWorth];
      }
    });
  });
  return arrFinal;
};
function ercWorth(arr) {
  let worth = 0;
  arr.forEach((r) => {
    worth = worth + Number(r[4]);
  });
  return Number(worth);
};
function ercDescriptionGenerator(arr) {
  let description = "\`\`\`Name - Symbol - Rate [ USD ] - Balance - Worth [ USD ]\n";
  arr.forEach((e) => {
    const line = e.join(" - ");
    description = description + "\n" + line;
  });
  description = description + "```";
  return description;
};
function concatenateArrays(arr1, arr2) {
  let array = [];
  arr1.forEach((e) => {
    const find = arr2.find(el => el[0] === e[0]);
    if (!find) {
      array.push(e);
    } else {
      const number_1 = e[2];
      const number_2 = find[2];
      const total = number_1 + number_2;
      array.push([e[0], e[1], total]);
    };
  });
  arr2.forEach((e) => {
    const find = array.find(el => el[0] === e[0]);
    if (!find) {
      array.push(e);
    };
  });
  return array;
};
function switchIt(n, newCollections) {
  let embeds = [];
  switch (n) {
    case 1:
      collectionsPerArray = newCollections;
      const description = descriptionGenerator(collectionsPerArray);
      const embed = embedGenerator("Floor Prices of Collections Owned", null, description);
      embeds.push(embed);
      break;
    case 2:
      collectionsPerArray = arraySplitter(newCollections, 2);
      collectionsPerArray.forEach((collect) => {
        const description = descriptionGenerator(collect);
        const embed = embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 3:
      collectionsPerArray = arraySplitter(newCollections, 3);
      collectionsPerArray.forEach((collect) => {
        const description = descriptionGenerator(collect);
        const embed = embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 4:
      collectionsPerArray = arraySplitter(newCollections, 4);
      collectionsPerArray.forEach((collect) => {
        const description = descriptionGenerator(collect);
        const embed = embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 5:
      collectionsPerArray = arraySplitter(newCollections, 5);
      collectionsPerArray.forEach((collect) => {
        const description = descriptionGenerator(collect);
        const embed = embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 6:
      collectionsPerArray = arraySplitter(newCollections, 6);
      collectionsPerArray.forEach((collect) => {
        const description = descriptionGenerator(collect);
        const embed = embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 7:
      collectionsPerArray = arraySplitter(newCollections, 7);
      collectionsPerArray.forEach((collect) => {
        const description = descriptionGenerator(collect);
        const embed = embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 8:
      collectionsPerArray = arraySplitter(newCollections, 8);
      collectionsPerArray.forEach((collect) => {
        const description = descriptionGenerator(collect);
        const embed = awaembedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 9:
      collectionsPerArray = arraySplitter(newCollections, 9);
      collectionsPerArray.forEach((collect) => {
        const description = descriptionGenerator(collect);
        const embed = embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 10:
    default:
      if (n > 10) newCollections = newCollections.slice(0, 299);
      collectionsPerArray = arraySplitter(newCollections, 10);
      collectionsPerArray.forEach((collect) => {
        const description = descriptionGenerator(collect);
        const embed = embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
  };
  return embeds;
};

////////////// ASYNC FUNCTIONS //////////////

async function getCollections(wallet) {
  let collectionsxd = [];
  let collections_owned = [];
  const collections_url = `https://api.opensea.io/api/v1/collections?asset_owner=${wallet}&limit=300`;
  do {
    collections_owned = await getUrlOSAPI(collections_url);
  } while (!Array.isArray(collections_owned))
  collections_owned.forEach((collection) => {
    const find = collectionsxd.find((e) => {
      e[0] === collection.name
    });
    if (!find) {
      collectionsxd.push([collection.name, collection.slug, Number(collection.owned_asset_count)]);
    } else {
      const ownedOld1 = collectionsxd[collectionsxd.indexOf(find)];
      const ownedOld2 = ownedOld1[2];
      collectionsxd[collectionsxd.indexOf(find)] = [collection.name, collection.slug, ownedOld2 + Number(collection.owned_asset_count)];
    };
  });
  return collectionsxd;
};
async function getEther(stra) {
  const remainingRequests = await limiter_eth.removeTokens(1);
  if (remainingRequests < 0) return;
  const etherscanUrl = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${stra}&tag=latest&apikey=${etherscan_key[ekv++]}`;
  if (ekv === eklength) ekv = 0;
  const balanceResponse = await fetch(etherscanUrl);
  const balanceResult = await balanceResponse.json();
  return balanceResult;
};
async function getUrlOSAPI(url) {
  const remainingRequests = await limiter_OS.removeTokens(1);
  if (remainingRequests < 0) return;
  const result = await fetch(url,options);
  const response = await result.json();
  return response;
};
async function ether_usd() {
  const remainingRequests = await limiter_eth.removeTokens(1);
  if (remainingRequests < 0) return;
  const etherurl = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${etherscan_key[ekv++]}`;
  if (ekv === eklength) ekv = 0;
  const etherresult = await fetch(etherurl);
  const etherresponse = await etherresult.json();
  const eth_usd = (Number(etherresponse.result.ethusd)).toFixed(2);
  const final = Number(eth_usd);
  return final;
};
async function getUrlCovalent(url) {
  const remainingRequests = await limiter_cv.removeTokens(1);
  if (remainingRequests < 0) return;
  const response = await fetch(url);
  const result = await response.json();
  return result;
};

module.exports = {
  name: "refresh",
  async interact(client, interaction) {
    try {
      await interaction.deferUpdate();
      let dm = false;
      let savedDm = false;
      const channel = await client.channels.fetch(interaction.channelId);
      if (channel.type === "DM" || channel.type === "GROUP_DM") dm = true;
      const find = await config_records.findOne({
        discord_id: interaction.user.id,
      });
      if (!find) return;
      savedDm = find.dm;
      if (savedDm !== dm) return;
      const channels = find.channel_ids;
      if (!savedDm && !channels.includes(interaction.channelId)) return;
      const messages = find.message_ids;
      const wallets = find.wallets;
      const nft_wallets = find.nft_wallets;
      const loading = await interaction.channel.send({
        content: "<a:loading:973124874124005396>"
      });
      const userid = find.discord_id;
      const user = await client.users.fetch(userid);
      const usertag = user.tag;
      let nft_worth = 0;
      let eth_nft = 0;
      let ErcWorthEth = 0;
      let guild_id = "";
      if (!dm) guild_id = find.guild_id;
      const findSub = await sub_records.findOne({
        discord_id: interaction.user.id,
      });
      const endTimestamp = findSub.end_timestamp;
      const diff = endTimestamp - Date.now();
      if (diff <= 1000 * 60 * 60 * 24 * 3) {
        if (diff >= 1000 * 60 * 60 * 24 * 2) {
          await interaction.followUp({
            content: `Your subscription ends within 3 days on <t:${parseInt(endTimestamp / 1000)}:F>.\n[Contact us](https://discord.gg/HweZtrzAnX 'Click to extend subscription') to extend subscription and contiue using the service without any interruption!!!`,
            ephemeral: true,
          }).catch((e) => { });
        } else if (diff >= 1000 * 60 * 60 * 24 * 1 && diff <= 1000 * 60 * 60 * 24 * 2) {
          await interaction.followUp({
            content: `Your subscription ends within 2 days on <t:${parseInt(endTimestamp / 1000)}:F>.\n[Contact us](https://discord.gg/HweZtrzAnX 'Click to extend subscription') to extend subscription and contiue using the service without any interruption!!!`,
            ephemeral: true,
          }).catch((e) => { });
        } else {
          await interaction.followUp({
            content: `Your subscription ends within a day on <t:${parseInt(endTimestamp / 1000)}:F>.\n[Contact us](https://discord.gg/HweZtrzAnX 'Click to extend subscription') to extend subscription and contiue using the service without any interruption!!!`,
            ephemeral: true,
          }).catch((e) => { });
        };
      };
      await interaction.followUp({
        content: "Please do not spam the command and allow the application to update everything . Usually this is quick , but somestimes it may take few mins depending on traffic !\nThank you.",
        ephemeral: true,
      }).catch((e) => { });

      //////////// WALLETS OPERATIONS HERE ////////////

      let ether_usd_price = "";
      let etherResponse = "";
      do {
        ether_usd_price = await ether_usd();
      } while (typeof ether_usd_price !== "number")
      const addressString = wallets.join(",");
      do {
        etherResponse = await getEther(addressString);
      } while (!etherResponse || etherResponse.message !== "OK")
      const balanceWei = etherResponse.result;
      const balanceOverall = balanceWei.map((e) => [e.account, (Number(e.balance) / Math.pow(10, 18)).toFixed(4), ((Number(e.balance) / Math.pow(10, 18)) * ether_usd_price).toFixed(2)]);
      const walletEmbed = embedGenerator(`${usertag}\'s Wallets`, null, walletDescriptionGenerator(balanceOverall));
      if (dm) {
        const walletMessage = await channel.messages.fetch(messages[1]);
        walletMessage.edit({
          embeds: [walletEmbed],
          content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
          components: [],
        }).catch((e) => { });
      } else {
        const walletChannel = await client.guilds.cache.get(guild_id).channels.fetch(channels[1]).catch((e) => { });
        if (!walletChannel) return interaction.followUp({
          content: "The wallets channel was not found. Please \`/config\` again.",
          ephemeral: true,
        }).then(await loading.delete().catch(() => { }));
        const walletMessage = await walletChannel.messages.fetch(messages[1]).catch((e) => { });
        if (!walletMessage) return interaction.followUp({
          content: "The wallets message was not found. Please \`/config\` again.",
          ephemeral: true,
        }).then(await loading.delete().catch(() => { }));
        walletMessage.edit({
          embeds: [walletEmbed],
          components: [row],
          content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
        }).catch((e) => { });
      };
      const liquid_eth = liquidCalculator(balanceOverall);

      //////////// NFT OPERATIONS HERE ////////////

      const collections_1 = await getCollections(nft_wallets[0]);
      let collections_2 = [];
      if (nft_wallets.length === 2) {
        collections_2 = await getCollections(nft_wallets[1]);
      };
      const collections = concatenateArrays(collections_1, collections_2);
      if (collections.length) {
        let newCollections = [];
        collections.forEach(async (collection) => {
          let stats = "";
          const statsUrl = `https://api.opensea.io/api/v1/collection/${collection[1]}/stats`;
          do {
            stats = await getUrlOSAPI(statsUrl);
          } while (!stats || !stats.stats)
          let floor = Number(stats.stats.floor_price);
          if (!floor) floor = 0;
          if (collections[1] === "cryptopunks") floor = 50;
          newCollections.push([collection[2], collection[0], floor.toFixed(4), (floor * ether_usd_price).toFixed(2), (floor * collection[2]).toFixed(4)]);
          nft_worth = nft_worth + Number((floor * collection[2]).toFixed(4));
          if (collections.length !== newCollections.length) return;
          const numberOfEmbeds = Math.ceil(newCollections.length / 30);
          const floorEmbeds = switchIt(numberOfEmbeds, newCollections);
          if (!dm) {
            const floorChannel = await client.guilds.cache.get(guild_id).channels.fetch(channels[0]).catch((e) => { });
            if (!floorChannel) return interaction.followUp({
              content: "The floors channel was not found. Please \`/config\` again.",
              ephemeral: true,
            }).then(await loading.delete().catch(() => { }));
            const floorMessage = await floorChannel.messages.fetch(messages[0]).catch((e) => { });
            if (!floorMessage) return interaction.followUp({
              content: "The floors message was not found. Please \`/config\` again.",
              ephemeral: true,
            }).then(await loading.delete().catch(() => { }));
            if (floorEmbeds.length === 1) {
              await floorMessage.edit({
                embeds: [floorEmbeds[0]],
                content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                components: [row],
              }).catch((e) => { });
            } else {
              await floorMessage.edit({
                embeds: [floorEmbeds[0]],
                content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                components: [row_left],
              }).catch((e) => { });
              let counter = 0;
              const collector = floorMessage.createMessageComponentCollector({
                componentType: 'BUTTON',
                idle: 120000
              });
              collector.on("collect", async (i) => {
                await i.deferUpdate();
                if (counter === 0 && i.customId === "left") return;
                if (counter === floorEmbeds.length - 1 && i.customId === "right") return;
                if (i.customId === "right") {
                  ++counter;
                  let xdRow = counter === floorEmbeds.length - 1 ? row_right : row_middle;
                  await floorMessage.edit({
                    embeds: [floorEmbeds[counter]],
                    components: [xdRow],
                  }).catch((e) => { });
                } else if (i.customId === "left") {
                  --counter
                  let xdRow = counter === 0 ? row_left : row_middle;
                  await floorMessage.edit({
                    embeds: [floorEmbeds[counter]],
                    components: [xdRow],
                  }).catch((e) => { });
                }
              });
              collector.on("end", async (collected) => {
                await floorMessage.edit({
                  components: [row],
                }).catch((e) => { });
                return;
              });
            };
          } else {
            const floorMessage = await channel.messages.fetch(messages[0]);
            if (floorEmbeds.length === 1) {
              await floorMessage.edit({
                embeds: [floorEmbeds[0]],
                components: [],
                content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
              }).catch((e) => { });
            } else {
              await floorMessage.edit({
                embeds: [floorEmbeds[0]],
                content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                components: [row_left],
              }).catch((e) => { });
              let counter = 0;
              const collector = floorMessage.createMessageComponentCollector({
                componentType: 'BUTTON',
                idle: 120000
              });
              collector.on("collect", async (i) => {
                await i.deferUpdate();
                if (counter === 0 && i.customId === "left") return;
                if (counter === floorEmbeds.length - 1 && i.customId === "right") return;
                if (i.customId === "right") {
                  ++counter;
                  let xdRow = counter === floorEmbeds.length - 1 ? row_right : row_middle;
                  await floorMessage.edit({
                    embeds: [floorEmbeds[counter]],
                    components: [xdRow],
                  }).catch((e) => { });
                } else if (i.customId === "left") {
                  --counter
                  let xdRow = counter === 0 ? row_left : row_middle;
                  await floorMessage.edit({
                    embeds: [floorEmbeds[counter]],
                    components: [xdRow],
                  }).catch((e) => { });
                }
              });
              collector.on("end", async (collected) => {
                await floorMessage.edit({
                  components: [],
                }).catch((e) => { });
                return;
              });
            };
          };
          const eth_nft = nft_worth.toFixed(4);

          ////////////// ERC 20 OPERATIONS //////////////

          let ercResponses = [];
          let ercWorthUSD = 0;
          wallets.forEach(async (wallet) => {
            let ercResponse = "";
            const url = `https://api.covalenthq.com/v1/1/address/${wallet}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=${process.env['covalent_key']}`;
            do {
              ercResponse = await getUrlCovalent(url);
            } while (!ercResponse || !ercResponse?.data?.items)
            let tokens = [];
            const tokensInitial = ercResponse.data.items;
            tokensInitial.forEach((token) => {
              if (!permittedContracts.includes(token.contract_address.toLowerCase())) return;
              tokens.push(token);
            });
            if (tokens.length) {
              const balances = tokens.map((e) => [e.contract_name, e.contract_ticker_symbol, e.quote_rate ? e.quote_rate.toFixed(4) : 0, (Number(e.balance) / Math.pow(10, e.contract_decimals)).toFixed(4), e.quote ? e.quote.toFixed(2) : 0]);
              ercResponses.push(balances);
            } else {
              const balances = [];
              ercResponses.push(balances);
            }
            if (ercResponses.length !== wallets.length) return;
            let ercFinal = ercProcess(ercResponses);
            if (ercFinal.length) {
              ercWorthUSD = ercWorth(ercFinal);
              if (ercFinal.length > 40) ercFinal = ercFinal.slice(0, 40);
              const ercDescription = ercDescriptionGenerator(ercFinal);
              const ercEmbed = embedGenerator(`${usertag}\'s ERC-20 Tokens`, null, ercDescription);
              if (!dm) {
                const ercChannel = await client.guilds.cache.get(guild_id).channels.fetch(channels[3]).catch((e) => { });
                if (!ercChannel) return interaction.followUp({
                  content: "The ERC-20 channel was not found. Please \`/config\` again.",
                  ephemeral: true
                }).then(await loading.delete().catch(() => { }));
                const ercMessage = await ercChannel.messages.fetch(messages[3]).catch((e) => { });
                if (!ercMessage) return interaction.followUp({
                  content: "The ERC-20 message was not found. Please \`/config\` again.",
                  ephemeral: true
                }).then(await loading.delete().catch(() => { }));
                ercMessage.edit({
                  embeds: [ercEmbed],
                  content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                  components: [row],
                }).catch((e) => { });
              } else {
                const ercMessage = await channel.messages.fetch(messages[3]);
                ercMessage.edit({
                  embeds: [ercEmbed],
                  content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                  components: [],
                }).catch((e) => { });
              };
            } else {
              if (!dm) {
                const ercChannel = await client.guilds.cache.get(guild_id).channels.fetch(channels[3]).catch((e) => { });
                if (!ercChannel) return interaction.followUp({
                  content: "The ERC-20 channel was not found. Please \`/config\` again.",
                  ephemeral: true
                }).then(await loading.delete().catch(() => { }));
                const ercMessage = await ercChannel.messages.fetch(messages[3]).catch((e) => { });
                if (!ercMessage) return interaction.followUp({
                  content: "The ERC-20 message was not found. Please \`/config\` again.",
                  ephemeral: true
                }).then(await loading.delete().catch(() => { }));
                ercMessage.edit({
                  content: `NO ERC-20 TOKENS FOUND\nLast Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                  embeds: [],
                  components: [row],
                }).catch((e) => { });
              } else {
                const ercMessage = await channel.messages.fetch(messages[3]);
                ercMessage.edit({
                  content: `NO ERC-20 TOKENS FOUND\nLast Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                  embeds: [],
                  components: [],
                }).catch((e) => { });
              }
            };
            ErcWorthEth = ercWorthUSD / ether_usd_price;

            ////////////// PORTFOLIO HANDLING //////////////

            const totalEth = Number(Number(liquid_eth) + Number(eth_nft) + Number(ErcWorthEth)).toFixed(4);
            const totalEthUSD = (totalEth * ether_usd_price).toFixed(2);
            const portFolioDescription = `:white_medium_small_square: **LIQUID**\n:white_small_square: TOTAL LIQUID ETH : Ξ ${Number(liquid_eth).toFixed(4)}\n:white_small_square: TOTAL LIQUID ETH [ USD ] : $ ${(Number(liquid_eth) * ether_usd_price).toFixed(2)}\n\n:white_medium_small_square: **NFT(S)**\n:white_small_square: TOTAL ETH IN NFT(S) : Ξ ${Number(eth_nft).toFixed(4)}\n:white_small_square: TOTAL ETH IN NFT(S) [ USD ] : $ ${(Number(eth_nft) * ether_usd_price).toFixed(2)}\n\n:white_medium_small_square: **ERC-20 TOKEN(S)**\n:white_small_square: TOTAL WORTH OF ERC-20 TOKEN(S) [ ETH ] : Ξ ${Number(ErcWorthEth).toFixed(4)}\n:white_small_square: TOTAL WORTH OF ERC-20 TOKEN(S) [ USD ] : $ ${Number(ercWorthUSD).toFixed(2)}\n\n:white_medium_small_square: **OVERALL**\n:white_small_square: TOTAL ETH : Ξ ${totalEth}\n:white_small_square: TOTAL ETH [ USD ] : $ ${totalEthUSD}`;
            const portFolioEmbed = embedGenerator(`${usertag}\'s Portfolio`, null, portFolioDescription);
            if (!dm) {
              const portfolioChannel = await client.guilds.cache.get(guild_id).channels.fetch(channels[2]).catch((e) => { });
              if (!portfolioChannel) return interaction.followUp({
                content: "The portfolio channel was not found. Please \`/config\` again.",
                ephemeral: true
              }).then(await loading.delete().catch(() => { }));
              const portfolioMessage = await portfolioChannel.messages.fetch(messages[2]).catch((e) => { });
              if (!portfolioMessage) return interaction.followUp({
                content: "The portfolio message was not found. Please \`/config\` again.",
                ephemeral: true
              }).then(await loading.delete().catch(() => { }));
              await portfolioMessage.edit({
                embeds: [portFolioEmbed],
                content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                components: [row],
              }).catch((e) => { });
              await loading.delete().catch(() => { });
            } else {
              const portfolioMessage = await channel.messages.fetch(messages[2]);
              await portfolioMessage.edit({
                embeds: [portFolioEmbed],
                content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                components: [row],
              }).catch((e) => { });
              await loading.delete().catch(() => { });
            };
          });
        });
      } else {
        if (!dm) {
          const floorChannel = await client.guilds.cache.get(guild_id).channels.fetch(channels[0]).catch((e) => { });
          if (!floorChannel) return interaction.followUp({
            content: "The floors channel was not found. Please \`/config\` again.",
            ephemeral: true
          }).then(await loading.delete().catch(() => { }));
          const floorMessage = await floorChannel.messages.fetch(messages[0]).catch((e) => { });
          if (!floorMessage) return interaction.followUp({
            content: "The floors message was not found. Please \`/config\` again.",
            ephemeral: true
          }).then(await loading.delete().catch(() => { }));
          floorMessage.edit({
            content: `NO NFTS FOUND\nLast Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
            embeds: [],
            components: [row],
          }).catch((e) => { });
        } else {
          const floorMessage = await channel.messages.fetch(messages[0]);
          floorMessage.edit({
            content: `NO NFTS FOUND\nLast Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
            embeds: [],
            components: [],
          }).catch((e) => { });
        };

        /////////////// ERC 20 OPERATIONS ///////////////

        let ercResponses = [];
        let ercWorthUSD = 0;
        wallets.forEach(async (wallet) => {
          let ercResponse = "";
          const url = `https://api.covalenthq.com/v1/1/address/${wallet}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=${process.env['covalent_key']}`;
          do {
            ercResponse = await getUrlCovalent(url);
          } while (!ercResponse || !ercResponse?.data?.items)
          let tokens = [];
          const tokensInitial = ercResponse.data.items;
          tokensInitial.forEach((token) => {
            if (!permittedContracts.includes(token.contract_address.toLowerCase())) return;
            tokens.push(token);
          });
          if (tokens.length) {
            const balances = tokens.map((e) => [e.contract_name, e.contract_ticker_symbol, e.quote_rate ? e.quote_rate.toFixed(4) : 0, (Number(e.balance) / Math.pow(10, e.contract_decimals)).toFixed(4), e.quote ? e.quote.toFixed(2) : 0]);
            ercResponses.push(balances);
          } else {
            const balances = [];
            ercResponses.push(balances);
          }
          if (ercResponses.length !== wallets.length) return;
          let ercFinal = ercProcess(ercResponses);
          if (ercFinal.length) {
            ercWorthUSD = ercWorth(ercFinal);
            if (ercFinal.length > 40) ercFinal = ercFinal.slice(0, 40);
            const ercDescription = ercDescriptionGenerator(ercFinal);
            const ercEmbed = embedGenerator(`${usertag}\'s ERC-20 Tokens`, null, ercDescription);
            if (!dm) {
              const ercChannel = await client.guilds.cache.get(guild_id).channels.fetch(channels[3]).catch((e) => { });
              if (!ercChannel) return interaction.followUp({
                content: "The ERC-20 channel was not found. Please \`/config\` again.",
                ephemeral: true,
              }).then(await loading.delete().catch(() => { }));
              const ercMessage = await ercChannel.messages.fetch(messages[3]).catch((e) => { });
              if (!ercMessage) return interaction.followUp({
                content: "The ERC-20 message was not found. Please \`/config\` again.",
                ephemeral: true,
              }).then(await loading.delete().catch(() => { }));
              ercMessage.edit({
                embeds: [ercEmbed],
                content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                components: [row],
              }).catch((e) => { });
            } else {
              const ercMessage = await channel.messages.fetch(messages[3]);
              ercMessage.edit({
                embeds: [ercEmbed],
                content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                components: [],
              }).catch((e) => { });
            };
          } else {
            if (!dm) {
              const ercChannel = await client.guilds.cache.get(guild_id).channels.fetch(channels[3]).catch((e) => { });
              if (!ercChannel) return interaction.followUp({
                content: "The ERC-20 channel was not found. Please \`/config\` again.",
                ephemeral: true
              }).then(await loading.delete().catch(() => { }));
              const ercMessage = await ercChannel.messages.fetch(messages[3]).catch((e) => { });
              if (!ercMessage) return interaction.followUp({
                content: "The ERC-20 message was not found. Please \`/config\` again.",
                ephemeral: true
              }).then(await loading.delete().catch(() => { }));
              ercMessage.edit({
                content: `NO ERC-20 TOKENS FOUND\nLast Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                embeds: [],
                components: [row],
              }).catch((e) => { });
            } else {
              const ercMessage = await channel.messages.fetch(messages[3]);
              ercMessage.edit({
                content: `NO ERC-20 TOKENS FOUND\nLast Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                embeds: [],
                components: [],
              }).catch((e) => { });
            }
          };
          ErcWorthEth = ercWorthUSD / ether_usd_price;

          ////////////// PORTFOLIO HANDLING //////////////

          const totalEth = Number(Number(liquid_eth) + Number(eth_nft) + Number(ErcWorthEth)).toFixed(4);
          const totalEthUSD = (totalEth * ether_usd_price).toFixed(2);
          const portFolioDescription = `:white_medium_small_square: **LIQUID**\n:white_small_square: TOTAL LIQUID ETH : Ξ ${Number(liquid_eth).toFixed(4)}\n:white_small_square: TOTAL LIQUID ETH [ USD ] : $ ${(Number(liquid_eth) * ether_usd_price).toFixed(2)}\n\n:white_medium_small_square: **NFT(S)**\n:white_small_square: TOTAL ETH IN NFT(S) : Ξ ${Number(eth_nft).toFixed(4)}\n:white_small_square: TOTAL ETH IN NFT(S) [ USD ] : $ ${(Number(eth_nft) * ether_usd_price).toFixed(2)}\n\n:white_medium_small_square: **ERC-20 TOKEN(S)**\n:white_small_square: TOTAL WORTH OF ERC-20 TOKEN(S) [ ETH ] : Ξ ${Number(ErcWorthEth).toFixed(4)}\n:white_small_square: TOTAL WORTH OF ERC-20 TOKEN(S) [ USD ] : $ ${Number(ercWorthUSD).toFixed(2)}\n\n:white_medium_small_square: **OVERALL**\n:white_small_square: TOTAL ETH : Ξ ${totalEth}\n:white_small_square: TOTAL ETH [ USD ] : $ ${totalEthUSD}`;
          const portFolioEmbed = embedGenerator(`${usertag}\'s Portfolio`, null, portFolioDescription);
          if (!dm) {
            const portfolioChannel = await client.guilds.cache.get(guild_id).channels.fetch(channels[2]).catch((e) => { });
            if (!portfolioChannel) return interaction.followUp({
              content: "The portfolio channel was not found. Please \`/config\` again.",
              ephemeral: true
            }).then(await loading.delete().catch(() => { }));
            const portfolioMessage = await portfolioChannel.messages.fetch(messages[2]).catch((e) => { });
            if (!portfolioMessage) return interaction.followUp({
              content: "The portfolio message was not found. Please \`/config\` again.",
              ephemeral: true
            }).then(await loading.delete().catch(() => { }));
            await portfolioMessage.edit({
              embeds: [portFolioEmbed],
              content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
              components: [row],
            }).catch((e) => { });
            await loading.delete().catch(() => { });
          } else {
            const portfolioMessage = await channel.messages.fetch(messages[2]);
            await portfolioMessage.edit({
              embeds: [portFolioEmbed],
              content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
              components: [row],
            }).catch((e) => { });
            await loading.delete().catch(() => { });
          };
        });
      };
    } catch (e) {
      console.log(e);
      if (interaction.deferred) {
        await interaction.followUp({
          content: "I am facing some issues , the dev has been informed . Please try again in some hours.",
          embeds: [],
          components: [],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "I am facing some issues , the dev has been informed . Please try again in some hours.",
          embeds: [],
          components: [],
          ephemeral: true,
        });
      };
      client.users.cache.get("727498137232736306").send(`Bobot has trouble in refresh.js -\n\n${e}`);
    };
  }
}