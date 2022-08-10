const { ActionRowBuilder, ButtonBuilder, PermissionsBitField, ButtonStyle, ChannelType, EmbedBuilder } = require("discord.js");
const config_records = require('../models/configRecords');
const sub_records = require('../models/subscriptionRecords');
const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setLabel("START")
      .setCustomId("refresh")
      .setStyle(ButtonStyle.Success),
  );
function MakeEmbed(des) {
  const embed = new EmbedBuilder()
    .setColor("#8A45FF")
    .setDescription(des)
    .setFooter({ text: "Powered by bobotlabs.xyz", iconURL: "https://cdn.discordapp.com/attachments/1003741555993100378/1003742971000266752/gif.gif" });
  return embed;
};
module.exports = {
  name: "config",
  async interact(client, interaction) {
    try {
      if (interaction.inGuild()) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const clientPermission = guild.members.me.permissions;
        if (!clientPermission.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ content: `I do not have the \`MANAGE_CHANNELS\` permission . Please grant me the permission before using this command.`, ephemeral: true });
        if (!clientPermission.has(PermissionsBitField.Flags.ReadMessageHistory)) return interaction.reply({ content: `I do not have the \`READ_MESSAGE_HISTORY\` permission . Please grant me the permission before using this command.`, ephemeral: true });
        if (!clientPermission.has(PermissionsBitField.Flags.SendMessages)) return interaction.reply({ content: `I do not have the \`SEND_MESSAGES\` permission . Please grant me the permission before using this command.`, ephemeral: true });
      };
      await interaction.deferReply({ ephemeral: true });
      const find = await sub_records.findOne({
        discord_id: interaction.user.id,
      });
      if (!find) return interaction.editReply({
        embeds: [MakeEmbed("You would need a valid subscription to use this command. Please contact us in [BoBot Labs Support Server](https://discord.gg/HweZtrzAnX) to get a subscription.")],
        ephemeral: true,
      });
      const channel = await client.channels.fetch(interaction.channelId);
      let dm = false;
      let sendDm = "";
      if (channel.type === ChannelType.DM) dm = true;
      if (!dm && !interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator) && !interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild) && interaction.user.id !== interaction.guild?.ownerId) return interaction.editReply({
        embeds: [MakeEmbed("This command can only be used by you in a Discord Server where either of the following apply:\n1) You are the Owner of the Discord Server.\n2) You have the **ADMINISTRATOR** permission in the server.\n3) You have the **MANAGE SERVER** permission in the server. Add me to your server by clicking on \"Add to Server\" on my profile.")],
        ephemeral: true,
      });
      if (dm) {
        sendDm = await interaction.user.send("Testing If I can DM you.").catch((e) => {
          sendDm = "e";
          interaction.editReply({ embeds: [MakeEmbed("I cannot DM you, Please check your privacy settings.\n\nNote: This is a slash command reply, this doesn't mean that I can message you, slash command reply ≠ message.")], ephemeral: true });
        });
        if (sendDm === "e") return;
      };
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
        embeds: [MakeEmbed(`The wallet you provided ${nft_1} is not a valid wallet address. Please don't use ENS. \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/HweZtrzAnX 'Click to join the support server!')`)],
        ephemeral: true,
      });
      if (nft_2) {
        nft_wallets.push(nft_2.trim().toLowerCase());
        wallets.push(nft_2.trim().toLowerCase());
        if (nft_2.trim().length !== 42 || !nft_2.trim().startsWith("0x")) return interaction.editReply({
          embeds: [MakeEmbed(`The wallet you provided ${nft_2} is not a valid wallet address. Please don't use ENS. \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/HweZtrzAnX 'Click to join the support server!')`)],
          ephemeral: true,
        });
      };
      if (eth_1) {
        wallets.push(eth_1.trim().toLowerCase());
        if (eth_1.trim().length !== 42 || !eth_1.trim().startsWith("0x")) return interaction.editReply({
          embeds: [MakeEmbed(`The wallet you provided ${eth_1} is not a valid wallet address. Please don't use ENS. \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/HweZtrzAnX 'Click to join the support server!')`)],
          ephemeral: true,
        });
      };
      if (eth_2) {
        wallets.push(eth_2.trim().toLowerCase());
        if (eth_2.trim().length !== 42 || !eth_2.trim().startsWith("0x")) return interaction.editReply({
          embeds: [MakeEmbed(`The wallet you provided ${eth_2} is not a valid wallet address. Please don't use ENS. \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/HweZtrzAnX 'Click to join the support server!')`)],
          ephemeral: true,
        });
      };
      if (eth_3) {
        wallets.push(eth_3.trim().toLowerCase());
        if (eth_3.trim().length !== 42 || !eth_3.trim().startsWith("0x")) return interaction.editReply({
          embeds: [MakeEmbed(`The wallet you provided ${eth_3} is not a valid wallet address. Please don't use ENS. \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/HweZtrzAnX 'Click to join the support server!')`)],
          ephemeral: true,
        });
      };
      if (eth_4) {
        wallets.push(eth_4.trim().toLowerCase());
        if (eth_4.trim().length !== 42 || !eth_4.trim().startsWith("0x")) return interaction.editReply({
          embeds: [MakeEmbed(`The wallet you provided ${eth_4} is not a valid wallet address. Please don't use ENS. \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/HweZtrzAnX 'Click to join the support server!')`)],
          ephemeral: true,
        });
      };
      if (eth_5) {
        wallets.push(eth_5.trim().toLowerCase());
        if (eth_5.trim().length !== 42 || !eth_5.trim().startsWith("0x")) return interaction.editReply({
          embeds: [MakeEmbed(`The wallet you provided ${eth_5} is not a valid wallet address. Please don't use ENS. \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/HweZtrzAnX 'Click to join the support server!')`)],
          ephemeral: true,
        });
      };
      if (eth_6) {
        wallets.push(eth_6.trim().toLowerCase());
        if (eth_6.trim().length !== 42 || !eth_6.trim().startsWith("0x")) return interaction.editReply({
          embeds: [MakeEmbed(`The wallet you provided ${eth_6} is not a valid wallet address. Please don't use ENS. \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/HweZtrzAnX 'Click to join the support server!')`)],
          ephemeral: true,
        });
      };
      if (eth_7) {
        wallets.push(eth_7.trim().toLowerCase());
        if (eth_7.trim().length !== 42 || !eth_7.trim().startsWith("0x")) return interaction.editReply({
          embeds: [MakeEmbed(`The wallet you provided ${eth_7} is not a valid wallet address. Please don't use ENS. \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/HweZtrzAnX 'Click to join the support server!')`)],
          ephemeral: true,
        });
      };
      if (eth_8) {
        wallets.push(eth_8.trim().toLowerCase());
        if (eth_8.trim().length !== 42 || !eth_8.trim().startsWith("0x")) return interaction.editReply({
          embeds: [MakeEmbed(`The wallet you provided ${eth_8} is not a valid wallet address. Please don't use ENS. \nIf you think this is a mistake please let us know in our [Discord Support Server](https://discord.gg/HweZtrzAnX 'Click to join the support server!')`)],
          ephemeral: true,
        });
      };
      if (!dm) {
        const category = await interaction.guild.channels.create({
          name: "🤖 BoBot PortFolio 🤖",
          type: ChannelType.GuildCategory
        });
        const floors_channel = await interaction.guild.channels.create({
          name: "📈︱floor-prices",
          parent: category,
          topic: "Get real time floor prices of collections owned by just clicking a button. Powered by BoBot : https://discord.gg/HweZtrzAnX !"
        });
        const erc20_channel = await interaction.guild.channels.create({
          name: "🪙︱erc-20-stats",
          parent: category,
          topic: "Get real time stats of ERC-20 tokens owned by just clicking a button. Powered by BoBot : https://discord.gg/HweZtrzAnX !"
        });
        const wallets_channel = await interaction.guild.channels.create({
          name: "💵︱wallets-stats",
          parent: category,
          topic: "Get real time stats of wallets owned by just clicking a button. Powered by BoBot : https://discord.gg/HweZtrzAnX !"
        });
        const portfolio_channel = await interaction.guild.channels.create({
          name: "💰︱portfolio",
          parent: category,
          topic: "Get real time portfolio by just clicking a button. Powered by BoBot : https://discord.gg/HweZtrzAnX !"
        });
        const channel_ids = [floors_channel.id, wallets_channel.id, portfolio_channel.id, erc20_channel.id];
        const floor_msg = await floors_channel.send({
          components: [row]
        });
        const erc20_msg = await erc20_channel.send({
          components: [row]
        });
        const wallet_msg = await wallets_channel.send({
          components: [row]
        });
        const portfolio_msg = await portfolio_channel.send({
          components: [row]
        });
        const message_ids = [floor_msg.id, wallet_msg.id, portfolio_msg.id, erc20_msg.id];
        await config_records.deleteOne({
          discord_id: interaction.user.id,
        }).catch((e) => {
          console.log(e)
        });
        await new config_records({
          discord_id: interaction.user.id,
          guild_id: interaction.guild.id,
          nft_wallets: nft_wallets,
          dm: false,
          wallets: wallets,
          channel_ids: channel_ids,
          message_ids: message_ids,
        }).save().catch((e) => {
          console.log(e)
        });
        return interaction.editReply({
          embeds: [MakeEmbed(`Your BoBot kit is setup at the category named \"BOBOT PORTFOLIO\" with channels <#${channel_ids.join("> , <#")}>.\nClicking any of the buttons in any channel will refresh all stats i.e. clicking the refresh button at floor channel will refresh all - floors, wallets, erc-20s, portfolio .....\n\nHope you can track your gains/losses better now!!!\nGoodluck on this journey! :slight_smile:`)],
          ephemeral: true,
        });
      } else {
        const channel_ids = [];
        const floor_msg = await interaction.user.send({
          content: "Floor Prices"
        });
        const erc20_msg = await interaction.user.send({
          content: "ERC-20 Tokens Stats"
        });
        const wallet_msg = await interaction.user.send({
          content: "Wallets Stats"
        });
        const portfolio_msg = await interaction.user.send({
          content: "Portfolio",
          components: [row]
        });
        const message_ids = [floor_msg.id, wallet_msg.id, portfolio_msg.id, erc20_msg.id];
        await config_records.deleteOne({
          discord_id: interaction.user.id,
        }).catch((e) => {
          console.log(e)
        });
        await new config_records({
          discord_id: interaction.user.id,
          guild_id: "NA",
          nft_wallets: nft_wallets,
          dm: true,
          wallets: wallets,
          channel_ids: channel_ids,
          message_ids: message_ids,
        }).save().catch((e) => {
          console.log(e)
        });
        await sendDm.delete().catch((e) => { });
        return interaction.editReply({
          embeds: [MakeEmbed(`Your BoBot kit is setup below, the button below is for floor prices, erc-20 tokens, wallets and entire portfolio refresh!\nHope you can track your gains/losses better now!!!\nGoodluck on this journey! :slight_smile:`)],
          ephemeral: true,
        });
      };
    } catch (e) {
      console.log(e);
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: "I am facing some issues, the dev has been informed. Please try again in some hours.",
          embeds: [],
          components: [],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "I am facing some issues, the dev has been informed. Please try again in some hours.",
          embeds: [],
          components: [],
          ephemeral: true,
        });
      };
      client.users.cache.get("727498137232736306").send(`${client.user.username} has trouble in config.js -\n\n${e}`);
    };
  }
}