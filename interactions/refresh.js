const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const mongoose = require("mongoose");
const {
    RateLimiter
} = require("limiter");
const config_records = require('../models/configRecords');
const etherscan_key = process.env['etherscan_key'];
const fetch = require("node-fetch");
const limiter_OS = new RateLimiter({
    tokensPerInterval: 4,
    interval: "second",
    fireImmediately: true
});
const limiter_eth = new RateLimiter({
    tokensPerInterval: 5,
    interval: "second",
    fireImmediately: true
});
async function getEther(stra) {
    const remainingRequests = await limiter_eth.removeTokens(1);
    if (remainingRequests < 0) return;
    const etherscanUrl = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${stra}&tag=latest&apikey=${etherscan_key}`;
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
        descriptionString = descriptionString + `:white_square_button: **WALLET ADDRESS** -\n **[${walletData[0]}](https://etherscan.io/address/${walletData[0]} "Click to view the wallet on etherscan")**\n:white_small_square: ETH HELD : Ξ ${walletData[1]}\n:white_small_square: ETH HELD [USD WORTH] : $ ${walletData[2]}\n\n`;
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
            if (numberOfEmbeds > 10) newCollections = newCollections.slice(0, 599);
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

module.exports = {
    name: "refresh",
    async interact(client, interaction) {
        let nft_worth = 0;
        await interaction.deferUpdate();
        try {
            // WALLET CHANNEL START
            let collections = [];
            let newCollections = [];
            let etherResponse = "";
            const configs = await config_records.find();
            configs.forEach(async (configuration) => {
                const channels = configuration.channel_ids;
                if (!channels.includes(interaction.channel.id)) return;
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
                const walletChannel = await client.guilds.cache.get(interaction.guild.id).channels.fetch(channels[1]).catch((e) => {});
                const walletmessage = await walletChannel.messages.fetch(messages[1]).catch((e) => {});
                const walletEmbed = embedGenerator(`${usertag}\'s Wallets`, null, walletDescriptionGenerator(balanceOverall));
                await walletmessage.edit({
                    embeds: [walletEmbed],
                    content: `Last Updated : <t:${parseInt(Date.now()/1000)}:R>`,
                    components: [row],
                });
                const liquid_eth = liquidCalculator(balanceOverall);
                // WALLET CHANNEL END
                // NFT START
                let collections_owned = "";
                nft_wallets.forEach(async (wallet) => {
                    collections_owned = "";
                    const collections_url = `https://api.opensea.io/api/v1/collections?asset_owner=${wallet}`;
                    do {
                        collections_owned = await getUrlOSAPI(collections_url);
                    } while (!collections_owned)
                    collections_owned.forEach((collection) => {
                        const find = collections.find((e) => {
                            e[0] === collection.name
                        });
                        if (!find) {
                            collections.push([collection.name, collection.slug, Number(collection.owned_asset_count)]);
                        } else {
                            const ownedOld1 = collections[collections.indexOf(find)];
                            const ownedOld2 = ownedOld1[2];
                            collections[collections.indexOf(find)] = [collection.name, collection.slug, ownedOld2 + Number(collection.owned_asset_count)];
                        };
                    });
                    if (nft_wallets.indexOf(wallet) !== nft_wallets.length - 1) return;
                    collections.forEach(async (collection) => {
                        let stats = "";
                        const statsUrl = `https://api.opensea.io/api/v1/collection/${collection[1]}/stats`;
                        do {
                            stats = await getUrlOSAPI(statsUrl);
                        } while (!stats || !stats.stats)
                        const floor = Number(stats.stats.floor_price);
                        //owned name floor floor_usd total_worth
                        newCollections.push([collection[2], collection[0], floor.toFixed(4), (floor * ether_usd_price).toFixed(2), (floor * collection[2]).toFixed(4)]);
                        nft_worth = nft_worth + Number((floor * collection[2]).toFixed(4));
                        if (collections.length !== newCollections.length) return;
                        let embeds = [];
                        let collectionsPerArray = [];
                        const numberOfEmbeds = Math.ceil(newCollections.length / 60);
                        const floorEmbed = await switchIt(numberOfEmbeds, newCollections);
                        const floorChannel = await client.guilds.cache.get(interaction.guild.id).channels.fetch(channels[0]).catch((e) => {});
                        const floorMessage = await floorChannel.messages.fetch(messages[0]).catch((e) => {});
                        await floorMessage.edit({
                            embeds: floorEmbed,
                            content: `Last Updated : <t:${parseInt(Date.now()/1000)}:R>`,
                            components: [row],
                        });
                        const eth_nft = nft_worth.toFixed(4);
                        // NFT ENDS
                        const totalEth = Number(liquid_eth) + Number(eth_nft);
                        const totalEthUSD = (totalEth * ether_usd_price).toFixed(2);
                        // POTFOLIO STARTS
                        const portFolioDescription = `:white_small_square: TOTAL LIQUID ETH : Ξ ${liquid_eth}\n:white_small_square: TOTAL LIQUID ETH [ USD ] : $ ${(liquid_eth*ether_usd_price).toFixed(2)}\n:white_small_square: TOTAL ETH IN NFT(S) : Ξ ${eth_nft}\n:white_small_square: TOTAL ETH IN NFT(S) [ USD ] : $ ${(eth_nft*ether_usd_price).toFixed(2)}\n:white_small_square: TOTAL ETH : Ξ ${totalEth}\n:white_small_square: TOTAL ETH [ USD ] : $ ${totalEthUSD}`;
                        const portFolioEmbed = embedGenerator(`${usertag}\'s Portfolio`, null, portFolioDescription);
                        const portfolioChannel = await client.guilds.cache.get(interaction.guild.id).channels.fetch(channels[2]).catch((e) => {});
                        const portfolioMessage = await portfolioChannel.messages.fetch(messages[2]).catch((e) => {});
                        await portfolioMessage.edit({
                            embeds: [portFolioEmbed],
                            content: `Last Updated : <t:${parseInt(Date.now()/1000)}:R>`,
                            components: [row],
                        });
                    });
                });
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