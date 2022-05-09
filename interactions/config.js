const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");
const mongoose = require("mongoose");
const config_records = require('../models/configRecords');
const sub_records = require('../models/subscriptionRecords');

const row = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setLabel("START")
      .setCustomId("refresh")
      .setStyle("SUCCESS"),
  );

module.exports = {
  name: "config",
  async interact(client, interaction) {
    let channel_ids = [];
    let message_ids = [];
    await interaction.deferReply();
    const find = await sub_records.findOne({
      discord_id: interaction.user.id,
    });
    if (!find) return interaction.editReply({
      content: "You would need a valid subscription to use this command . To learn more about subscriptions use the \`/subscribe\` slash command."
    });
    try {
      if (!interaction.memberPermissions.has("ADMINISTRATOR") && !interaction.memberPermissions.has("MANAGE_GUILD") && interaction.user.id !== interaction.guild.ownerId) return interaction.editReply({
        content: "This command can only be used by you in a Discord Server where either of the following apply :\n1) You are the Owner of the Discord Server.\n2) You have the **ADMINISTRATOR** permission in the server.\n3) You have the **MANAGE SERVER** permission in the server. Add me to your server by clicking on \"Add to Server\" on my profile or invite me using this link - https://discord.com/oauth2/authorize?client_id=969112729631735828&scope=bot%20applications.commands&permissions=67600 ."
      });
      let nft_wallets = [];
      let wallets = [];
      const nft_1 = interaction.options.getString('nft_1');
      const nft_2 = interaction.options.getString('nft_2');
      const eth_1 = interaction.options.getString('eth_1');
      const eth_2 = interaction.options.getString('eth_2');
      const eth_3 = interaction.options.getString('eth_3');
      const eth_4 = interaction.options.getString('eth_4');
      const eth_5 = interaction.options.getString('eth_5');
      const eth_6 = interaction.options.getString('eth_6');
      const eth_7 = interaction.options.getString('eth_7');
      const eth_8 = interaction.options.getString('eth_8');
      nft_wallets.push(nft_1.trim().toLowerCase());
      wallets.push(nft_1.trim().toLowerCase());
      if (nft_1.trim().length !== 42 || !nft_1.trim().startsWith("0x")) return interaction.editReply({
        content: `The wallet you provided ${nft_1} is not a valid wallet address . Please don't use ENS . \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !')`
      });
      if (nft_2) {
        nft_wallets.push(nft_2.trim().toLowerCase());
        wallets.push(nft_2.trim().toLowerCase());
        if (nft_2.trim().length !== 42 || !nft_2.trim().startsWith("0x")) return interaction.editReply({
          content: `The wallet you provided ${nft_2} is not a valid wallet address . Please don't use ENS . \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !')`
        });
      };
      if (eth_1) {
        wallets.push(eth_1.trim().toLowerCase());
        if (eth_1.trim().length !== 42 || !eth_1.trim().startsWith("0x")) return interaction.editReply({
          content: `The wallet you provided ${eth_1} is not a valid wallet address . Please don't use ENS . \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !')`
        });
      };
      if (eth_2) {
        wallets.push(eth_2.trim().toLowerCase());
        if (eth_2.trim().length !== 42 || !eth_2.trim().startsWith("0x")) return interaction.editReply({
          content: `The wallet you provided ${eth_2} is not a valid wallet address . Please don't use ENS . \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !')`
        });
      };
      if (eth_3) {
        wallets.push(eth_3.trim().toLowerCase());
        if (eth_3.trim().length !== 42 || !eth_3.trim().startsWith("0x")) return interaction.editReply({
          content: `The wallet you provided ${eth_3} is not a valid wallet address . Please don't use ENS . \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !')`
        });
      };
      if (eth_4) {
        wallets.push(eth_4.trim().toLowerCase());
        if (eth_4.trim().length !== 42 || !eth_4.trim().startsWith("0x")) return interaction.editReply({
          content: `The wallet you provided ${eth_4} is not a valid wallet address . Please don't use ENS . \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !')`
        });
      };
      if (eth_5) {
        wallets.push(eth_5.trim().toLowerCase());
        if (eth_5.trim().length !== 42 || !eth_5.trim().startsWith("0x")) return interaction.editReply({
          content: `The wallet you provided ${eth_5} is not a valid wallet address . Please don't use ENS . \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !')`
        });
      };
      if (eth_6) {
        wallets.push(eth_6.trim().toLowerCase());
        if (eth_6.trim().length !== 42 || !eth_6.trim().startsWith("0x")) return interaction.editReply({
          content: `The wallet you provided ${eth_6} is not a valid wallet address . Please don't use ENS . \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !')`
        });
      };
      if (eth_7) {
        wallets.push(eth_7.trim().toLowerCase());
        if (eth_7.trim().length !== 42 || !eth_7.trim().startsWith("0x")) return interaction.editReply({
          content: `The wallet you provided ${eth_7} is not a valid wallet address . Please don't use ENS . \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !')`
        });
      };
      if (eth_8) {
        wallets.push(eth_8.trim().toLowerCase());
        if (eth_8.trim().length !== 42 || !eth_8.trim().startsWith("0x")) return interaction.editReply({
          content: `The wallet you provided ${eth_8} is not a valid wallet address . Please don't use ENS . \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !')`
        });
      };
      interaction.guild.channels.create("BoBot PortFolio", {
        type: "GUILD_CATEGORY"
      })
        .then(async (category) => {
          const floors_channel = await category.createChannel("floors", {
            topic: "Get real time floor prices of collections owned by just clicking a button!!!"
          });
          const wallets_channel = await category.createChannel("wallets", {
            topic: "Get real time stats of wallets owned by just clicking a button!!!"
          });
          const portfolio_channel = await category.createChannel("portfolio", {
            topic: "Get real time portfolio by just clicking a button!!!"
          });
          channel_ids = [floors_channel.id, wallets_channel.id, portfolio_channel.id];
          const floor_msg = await floors_channel.send({
            components: [row]
          });
          const wallet_msg = await wallets_channel.send({
            components: [row]
          });
          const portfolio_msg = await portfolio_channel.send({
            components: [row]
          });
          message_ids = [floor_msg.id, wallet_msg.id, portfolio_msg.id];
          await config_records.deleteOne({
            discord_id: interaction.user.id,
          }).catch((e) => {
            console.log(e)
          });
          await new config_records({
            discord_id: interaction.user.id,
            nft_wallets: nft_wallets,
            wallets: wallets,
            channel_ids: channel_ids,
            message_ids: message_ids,
          }).save().catch((e) => {
            console.log(e)
          });
          return interaction.editReply({
            content: `Your Bobot kit is setup at the category named \"BOBOT PORTFOLIO\" with channels <#${channel_ids.join("> , <#")}>.\nHope you can track your gains/losses better now !!!\nGoodluck on this journey ! :slight_smile:`
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
      client.users.cache.get("727498137232736306").send(`Bobot has trouble config.js -\n\n${e}`);
    };
  },
}