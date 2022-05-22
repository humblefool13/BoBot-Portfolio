const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");
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
const mongoose = require("mongoose");
const {
  RateLimiter
} = require("limiter");
const config_records = require('../models/configRecords');
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
  const result = await fetch(url);
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
  return eth_usd;
};
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
const row = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setLabel("🔄")
      .setStyle("SUCCESS")
      .setCustomId("refresh")
  );
async function switchIt(n, newCollections) {
  let embeds = [];
  switch (n) {
    case 1:
      collectionsPerArray = newCollections;
      const description = await descriptionGenerator(collectionsPerArray);
      const embed = await embedGenerator("Floor Prices of Collections Owned", null, description);
      embeds.push(embed);
      break;
    case 2:
      collectionsPerArray = await arraySplitter(newCollections, 2);
      collectionsPerArray.forEach(async (collect) => {
        const description = await descriptionGenerator(collect);
        const embed = await embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 3:
      collectionsPerArray = arraySplitter(newCollections, 3);
      collectionsPerArray.forEach(async (collect) => {
        const description = await descriptionGenerator(collect);
        const embed = await embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 4:
      collectionsPerArray = arraySplitter(newCollections, 4);
      collectionsPerArray.forEach(async (collect) => {
        const description = await descriptionGenerator(collect);
        const embed = await embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 5:
      collectionsPerArray = arraySplitter(newCollections, 5);
      collectionsPerArray.forEach(async (collect) => {
        const description = await descriptionGenerator(collect);
        const embed = await embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 6:
      collectionsPerArray = arraySplitter(newCollections, 6);
      collectionsPerArray.forEach(async (collect) => {
        const description = await descriptionGenerator(collect);
        const embed = await embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 7:
      collectionsPerArray = arraySplitter(newCollections, 7);
      collectionsPerArray.forEach(async (collect) => {
        const description = await descriptionGenerator(collect);
        const embed = await embedGenerator("Floor Prices of Collections Owned", null, description);
        embeds.push(embed);
      });
      break;
    case 8:
      collectionsPerArray = arraySplitter(newCollections, 8);
      collectionsPerArray.forEach(async (collect) => {
        const description = await descriptionGenerator(collect);
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
async function concatenateArrays(arr1, arr2) {
  let array = [];
  arr1.forEach(async (e) => {
    const find = await arr2.find(el => el[0] === e[0]);
    if (!find) {
      array.push(e);
    } else {
      const number_1 = e[2];
      const number_2 = find[2];
      const total = number_1 + number_2;
      array.push([e[0], e[1], total]);
    };
  });
  arr2.forEach(async (e) => {
    const find = await array.find(el => el[0] === e[0]);
    if (!find) {
      array.push(e);
    };
  });
  return array;
};

module.exports = {
  name: "refresh",
  async interact(client, interaction) {
    let nft_worth = 0;
    let dm = false;
    await interaction.deferUpdate();
    const channelxd = await client.channels.fetch(interaction.channelId);
    if (channelxd.type === "DM" || channelxd.type === "GROUP_DM") dm = true;
    try {
      let collections = [];
      let newCollections = [];
      let etherResponse = "";
      const configs = await config_records.find();
      configs.forEach(async (configuration) => {
        if (!dm) {
          const channels = configuration.channel_ids;
          if (!channels.includes(interaction.channel.id)) return;
          const sentxd = await interaction.channel.send({
            content: "<a:CH_IconLoading:973124874124005396>\nThis message will delete automatically after all - floors , wallets , portfolio channels are updated. Sometimes it takes times depending on the traffic so please have patience."
          });
          const userid = configuration.discord_id;
          const user = await client.users.fetch(userid);
          const usertag = user.tag;
          const messages = configuration.message_ids;
          const nft_wallets = configuration.nft_wallets;
          const wallets = configuration.wallets;
          const addressString = wallets.join(",");
          const ether_usd_price = await ether_usd();
          do {
            etherResponse = await getEther(addressString);
          } while (!etherResponse || etherResponse.message !== "OK")
          const balanceWei = etherResponse.result;
          const balanceOverall = balanceWei.map((e) => [e.account, (Number(e.balance) / 1000000000000000000).toFixed(4), ((Number(e.balance) / 1000000000000000000) * ether_usd_price).toFixed(2)]);
          const walletChannel = await client.guilds.cache.get(interaction.guild.id).channels.fetch(channels[1]).catch((e) => {
            interaction.channel.send("The Wallets channel is not available . Please `/config` again.");
          });
          if (!walletChannel) return;
          const walletmessage = await walletChannel.messages.fetch(messages[1]).catch((e) => {
            interaction.channel.send("The Wallets message is not available . Please `/config` again.");
          });
          if (!walletmessage) return;
          const walletEmbed = embedGenerator(`${usertag}\'s Wallets`, null, walletDescriptionGenerator(balanceOverall));
          await walletmessage.edit({
            embeds: [walletEmbed],
            content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
            components: [row],
          });
          const liquid_eth = liquidCalculator(balanceOverall);
          const collections_1 = await getCollections(nft_wallets[0]);
          let collections_2 = [];
          if (nft_wallets.length === 2) {
            collections_2 = await getCollections(nft_wallets[1]);
          };
          collections = await concatenateArrays(collections_1, collections_2);
          if (collections.length) {
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
              let embeds = [];
              let collectionsPerArray = [];
              const numberOfEmbeds = Math.ceil(newCollections.length / 30);
              const floorEmbeds = await switchIt(numberOfEmbeds, newCollections);
              const floorChannel = await client.guilds.cache.get(interaction.guild.id).channels.fetch(channels[0]).catch((e) => {
                interaction.channel.send("The Floors channel is not available . Please `/config` again.")
              });
              if (!floorChannel) return;
              const floorMessage = await floorChannel.messages.fetch(messages[0]).catch((e) => {
                interaction.channel.send("The Floors Message is not available . Please `/config` again.")
              });
              if (!floorMessage) return;
              if (floorEmbeds.length === 1) {
                await floorMessage.edit({
                  embeds: [floorEmbeds[0]],
                  content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                  components: [row],
                });
              } else {
                await floorMessage.edit({
                  embeds: [floorEmbeds[0]],
                  content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                  components: [row_left],
                });
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
                    });
                  } else if (i.customId === "left") {
                    --counter
                    let xdRow = counter === 0 ? row_left : row_middle;
                    await floorMessage.edit({
                      embeds: [floorEmbeds[counter]],
                      components: [xdRow],
                    });
                  }
                });
                collector.on("end", async (collected) => {
                  await floorMessage.edit({
                    components: [row],
                  }).catch((e) => { });
                  return;
                });
              };
              const eth_nft = nft_worth.toFixed(4);
              const totalEth = Number(Number(liquid_eth) + Number(eth_nft)).toFixed(4);
              const totalEthUSD = (totalEth * ether_usd_price).toFixed(2);
              const portFolioDescription = `:white_small_square: TOTAL LIQUID ETH : Ξ ${liquid_eth}\n:white_small_square: TOTAL LIQUID ETH [ USD ] : $ ${(liquid_eth * ether_usd_price).toFixed(2)}\n:white_small_square: TOTAL ETH IN NFT(S) : Ξ ${eth_nft}\n:white_small_square: TOTAL ETH IN NFT(S) [ USD ] : $ ${(eth_nft * ether_usd_price).toFixed(2)}\n:white_small_square: TOTAL ETH : Ξ ${totalEth}\n:white_small_square: TOTAL ETH [ USD ] : $ ${totalEthUSD}`;
              const portFolioEmbed = embedGenerator(`${usertag}\'s Portfolio`, null, portFolioDescription);
              const portfolioChannel = await client.guilds.cache.get(interaction.guild.id).channels.fetch(channels[2]).catch((e) => {
                interaction.channel.send("The Portfolio channel is not available . Please `/config` again.")
              });
              if (!portfolioChannel) return;
              const portfolioMessage = await portfolioChannel.messages.fetch(messages[2]).catch((e) => {
                interaction.channel.send("The Portfolio Message is not available . Please `/config` again.")
              });
              if (!portfolioMessage) return;
              await portfolioMessage.edit({
                embeds: [portFolioEmbed],
                content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                components: [row],
              });
              await sentxd.delete().catch((e) => { });
            });
          } else {
            const floorChannel = await client.guilds.cache.get(interaction.guild.id).channels.fetch(channels[0]).catch((e) => {
              interaction.channel.send("The Floors channel is not available . Please `/config` again.")
            });
            if (!floorChannel) return;
            const floorMessage = await floorChannel.messages.fetch(messages[0]).catch((e) => {
              interaction.channel.send("The Floors Message is not available . Please `/config` again.")
            });
            if (!floorMessage) return;
            await floorMessage.edit({
              content: "No NFT on wallets provided",
            });
            const eth_nft = 0;
            const totalEth = Number(Number(liquid_eth) + Number(eth_nft)).toFixed(4);
            const totalEthUSD = (totalEth * ether_usd_price).toFixed(2);
            const portFolioDescription = `:white_small_square: TOTAL LIQUID ETH : Ξ ${liquid_eth}\n:white_small_square: TOTAL LIQUID ETH [ USD ] : $ ${(liquid_eth * ether_usd_price).toFixed(2)}\n:white_small_square: TOTAL ETH IN NFT(S) : Ξ ${eth_nft}\n:white_small_square: TOTAL ETH IN NFT(S) [ USD ] : $ ${(eth_nft * ether_usd_price).toFixed(2)}\n:white_small_square: TOTAL ETH : Ξ ${totalEth}\n:white_small_square: TOTAL ETH [ USD ] : $ ${totalEthUSD}`;
            const portFolioEmbed = embedGenerator(`${usertag}\'s Portfolio`, null, portFolioDescription);
            const portfolioChannel = await client.guilds.cache.get(interaction.guild.id).channels.fetch(channels[2]).catch((e) => {
              interaction.channel.send("The Portfolio channel is not available . Please `/config` again.")
            });
            if (!portfolioChannel) return;
            const portfolioMessage = await portfolioChannel.messages.fetch(messages[2]).catch((e) => {
              interaction.channel.send("The Portfolio Message is not available . Please `/config` again.")
            });
            if (!portfolioMessage) return;
            await portfolioMessage.edit({
              embeds: [portFolioEmbed],
              content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
              components: [row],
            });
            await sentxd.delete().catch((e) => { });
          }
        } else {
          if (interaction.user.id !== configuration.discord_id) return;
          if(configuration.channel_ids.length) return;
          const sentxd = await interaction.user.send({
            content: "<a:CH_IconLoading:973124874124005396>\nThis message will delete automatically after all - floors , wallets , portfolio messages are updated. Sometimes it takes times depending on the traffic so please have patience."
          });
          const userid = configuration.discord_id;
          const user = await client.users.fetch(userid);
          const usertag = user.tag;
          const messages = configuration.message_ids;
          const nft_wallets = configuration.nft_wallets;
          const wallets = configuration.wallets;
          const addressString = wallets.join(",");
          const ether_usd_price = await ether_usd();
          do {
            etherResponse = await getEther(addressString);
          } while (!etherResponse || etherResponse.message !== "OK")
          const balanceWei = etherResponse.result;
          const balanceOverall = balanceWei.map((e) => [e.account, (Number(e.balance) / 1000000000000000000).toFixed(4), ((Number(e.balance) / 1000000000000000000) * ether_usd_price).toFixed(2)]);
          const walletEmbed = embedGenerator(`${usertag}\'s Wallets`, null, walletDescriptionGenerator(balanceOverall));
          const channel = await interaction.user.dmChannel;
          const walletMessage = await channel.messages.fetch(messages[1]);
          await walletMessage.edit({
            embeds: [walletEmbed],
            content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
          });
          const liquid_eth = liquidCalculator(balanceOverall);
          const collections_1 = await getCollections(nft_wallets[0]);
          let collections_2 = [];
          if (nft_wallets.length === 2) {
            collections_2 = await getCollections(nft_wallets[1]);
          };
          collections = await concatenateArrays(collections_1, collections_2);
          if (collections.length) {
            collections.forEach(async (collection) => {
              let stats = "";
              const statsUrl = `https://api.opensea.io/api/v1/collection/${collection[1]}/stats`;
              do {
                stats = await getUrlOSAPI(statsUrl);
              } while (!stats || !stats.stats)
              let floor = Number(stats.stats.floor_price);
              if (!floor) floor = 0;
              if (collection[1] === "cryptopunks") floor = 50;
              newCollections.push([collection[2], collection[0], floor.toFixed(4), (floor * ether_usd_price).toFixed(2), (floor * collection[2]).toFixed(4)]);
              nft_worth = nft_worth + Number((floor * collection[2]).toFixed(4));
              if (collections.length !== newCollections.length) return;
              let embeds = [];
              let collectionsPerArray = [];
              const numberOfEmbeds = Math.ceil(newCollections.length / 30);
              const floorEmbeds = await switchIt(numberOfEmbeds, newCollections);
              const floorMessage = await channel.messages.fetch(messages[0]);
              if (floorEmbeds.length === 1) {
                await floorMessage.edit({
                  embeds: [floorEmbeds[0]],
                  content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                  components: null,
                });
              } else {
                await floorMessage.edit({
                  embeds: [floorEmbeds[0]],
                  content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                  components: [row_left],
                });
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
                    });
                  } else if (i.customId === "left") {
                    --counter
                    let xdRow = counter === 0 ? row_left : row_middle;
                    await floorMessage.edit({
                      embeds: [floorEmbeds[counter]],
                      components: [xdRow],
                    });
                  }
                });
                collector.on("end", async (collected) => {
                  await floorMessage.edit({
                    components: null,
                  }).catch((e) => { });
                  return;
                });
              };
              const eth_nft = nft_worth.toFixed(4);
              const totalEth = Number(Number(liquid_eth) + Number(eth_nft)).toFixed(4);
              const totalEthUSD = (totalEth * ether_usd_price).toFixed(2);
              const portFolioDescription = `:white_small_square: TOTAL LIQUID ETH : Ξ ${liquid_eth}\n:white_small_square: TOTAL LIQUID ETH [ USD ] : $ ${(liquid_eth * ether_usd_price).toFixed(2)}\n:white_small_square: TOTAL ETH IN NFT(S) : Ξ ${eth_nft}\n:white_small_square: TOTAL ETH IN NFT(S) [ USD ] : $ ${(eth_nft * ether_usd_price).toFixed(2)}\n:white_small_square: TOTAL ETH : Ξ ${totalEth}\n:white_small_square: TOTAL ETH [ USD ] : $ ${totalEthUSD}`;
              const portFolioEmbed = embedGenerator(`${usertag}\'s Portfolio`, null, portFolioDescription);
              const portfolioMessage = await channel.messages.fetch(messages[2]);
              await portfolioMessage.edit({
                embeds: [portFolioEmbed],
                content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
                components: [row],
              });
              await sentxd.delete().catch((e) => { });
            });
          } else {
            const floorMessage = await channel.messages.fetch(messages[0]);
            await floorMessage.edit({
              content: "No NFT available on provided wallets",
            });
            const eth_nft = 0;
            const totalEth = Number(Number(liquid_eth) + Number(eth_nft)).toFixed(4);
            const totalEthUSD = (totalEth * ether_usd_price).toFixed(2);
            const portFolioDescription = `:white_small_square: TOTAL LIQUID ETH : Ξ ${liquid_eth}\n:white_small_square: TOTAL LIQUID ETH [ USD ] : $ ${(liquid_eth * ether_usd_price).toFixed(2)}\n:white_small_square: TOTAL ETH IN NFT(S) : Ξ ${eth_nft}\n:white_small_square: TOTAL ETH IN NFT(S) [ USD ] : $ ${(eth_nft * ether_usd_price).toFixed(2)}\n:white_small_square: TOTAL ETH : Ξ ${totalEth}\n:white_small_square: TOTAL ETH [ USD ] : $ ${totalEthUSD}`;
            const portFolioEmbed = embedGenerator(`${usertag}\'s Portfolio`, null, portFolioDescription);
            const portfolioMessage = await channel.messages.fetch(messages[2]);
            await portfolioMessage.edit({
              embeds: [portFolioEmbed],
              content: `Last Updated : <t:${parseInt(Date.now() / 1000)}:R>`,
              components: [row],
            });
            await sentxd.delete().catch((e) => { });
          }
        }
      });
    } catch (e) {
      console.log(e);
      if (interaction.deferred) {
        await interaction.editReply({
          content: "I am facing some issues , the dev has been informed . Please try again in some hours.",
          embeds: null,
          components: null,
        });
      } else {
        await interaction.reply({
          content: "I am facing some issues , the dev has been informed . Please try again in some hours.",
          embeds: null,
          components: null,
        });
      };
      client.users.cache.get("727498137232736306").send(`Bobot has trouble refresh.js -\n\n${e}`);
    };
  }
}