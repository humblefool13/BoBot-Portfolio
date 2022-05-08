const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const mongoose = require("mongoose");
const decoder = new TextDecoder();
const config_records = require('../models/configRecords');
const etherscan_key = process.env['etherscan_key'];
const fetch = require("node-fetch");
async function getEther(stra) {
    const etherscanUrl = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${stra}&tag=latest&apikey=${etherscan_key}`;
    const balanceResponse = await fetch(etherscanUrl);
    const balanceResult = await balanceResponse.json();
    return balanceResult;
};
const scrapingbee = require('scrapingbee');
const scrapingbeeKey = process.env['scrapingBee_Key']
async function getUrlOSAPI(url) {
    const scraper = new scrapingbee.ScrapingBeeClient(scrapingbeeKey);
    const getUrl = await scraper.get({
        url: url,
        params: {
            'render_js': 'False',
            'json_response': 'True',
            'forward_headers_pure': 'True'
        },
    });
  const text = await decoder.decode(getUrl.data);
  const data = await JSON.parse(text);
  const here = data.body;
    return here;
};
async function ether_usd() {
    const etherurl = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${etherscan_key}`;
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
    let floorString = "Quantity - Name - Floor [ETH] - Floor [USD] - TOTAL";
    array.forEach((collection) => {
        floorString = floorString + `\n` + collection.join(" - ");
    });
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
        descriptionString = descriptionString + `:white_square_button: **WALLET ADDRESS** -\n **[${walletData[0]}](https://etherscan.io/address/${walletData[0]} "Click to view the wallet on etherscan")**\n:white_small_square: ETH HELD : Ξ ${walletData[1]}\n:white_small_square: ETH HELD [USD WORTH] : $ ${walletData[2]}\n\n`;
    });
    return descriptionString;
};
const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setLabel("🔄")
        .setStyle("SUCCESS")
        .setCustomId("refresh")
    );
function liquidCalculator(arr) {
    let liquidTotal = 0;
    arr.forEach((ar) => {
        liquidTotal = liquidTotal + ar[1];
    });
    return liquidTotal;
};

module.exports = {
  name: "refresh",
  async interact(client, interaction) {
    await interaction.deferUpdate();
    try{
      let collections = [];
      let walletCounter = 0;
      let collectionStats = [];
      let etherResponse = "";
      let collections_owned = "";
      let nft_worth = 0;
      const configs = await config_records.find();
      const configuration = await configs.find((e)=>e.channel_ids.includes(interaction.channel.id));
      const channels = configuration.channel_ids;
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
      } while (!etherResponse || etherResponse.message !== "OK");
      const balanceWei = etherResponse.result;
      const balanceOverall = balanceWei.map((e) => [e.account, (Number(e.balance) / 1000000000000000000).toFixed(4), ((Number(e.balance) / 1000000000000000000) * ether_usd_price).toFixed(2)]);
      const walletChannel = await client.guilds.cache.get(interaction.guild.id).channels.fetch(channels[1]).catch((e) => {});
      const walletmessage = await walletChannel.messages.fetch(messages[1]).catch((e) => {});
      const walletEmbed = embedGenerator(`${usertag}\'s Wallets`, null, walletDescriptionGenerator(balanceOverall));
      await walletmessage.edit({
        embeds: [walletEmbed],
        content: `Last Updated : <t:${parseInt(Date.now()/1000)}:R>`,
        components: [row],
      });
      const liquid_eth = liquidCalculator(balanceOverall);
      //WALLETS UPDATED
      nft_wallets.forEach(async(wallet)=>{
        const collections_url = `https://api.opensea.io/api/v1/collections?asset_owner=${wallet}`;
        collections_owned = await getUrlOSAPI(collections_url).catch((e)=>console.log(e));
        collections_owned.forEach((collection)=>{
          const find = collections.find((e)=>e[0]===collection.name);
          if(find){
            const ownedOld1 = collections[collections.indexOf(find)];
            const ownedOld2 = ownedOld1[2];
            collections[collections.indexOf(find)] = [collection.name, collection.slug, ownedOld2 + Number(collection.owned_asset_count)];
          }else{
            collections.push([collection.name, collection.slug, Number(collection.owned_asset_count)]);
          };
        });
        if(++walletCounter!==nft_wallets.length) return;
        collections.forEach(async(collection)=>{
          const statsUrl = `https://api.opensea.io/api/v1/collection/${collection[1]}/stats`;
          const stats = await getUrlOSAPI(statsUrl).catch((e)=>console.log(e.message));
          //console.log("\n\n\n\n");
          //console.log(stats);
        });
      });
    }catch(e){
      console.error(e);
    }
  }
}