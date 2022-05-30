const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = {
  name: "help",
  async interact(client, interaction) {
    try {
      const general = new MessageEmbed()
        .setTitle("BoBot Help")
        .setColor("#454be9")
        .setDescription("The Bot comes with the following commands :\n`/about` : About the Bot\n`/config` : To setup your wallets \n`/help` : This command\n`/subscribe` : Learn more about subscriptions");
      const subscription = new MessageEmbed()
        .setTitle("1) Subscription")
        .setColor("#454be9")
        .setDescription("To use the BoBot , you would first need a valid subscription . To learn more about subscriptions use the `/subscribe` slash command .");
      const config = new MessageEmbed()
        .setTitle("2) Configuring Wallets")
        .setColor("#454be9")
        .setDescription("You can have a total of 10 wallets per discord account . This will be saved using the \`/config\` slash command .\nHowever , the overall portfolio will be based on all your wallets together ( you cannot have two portfolios splitting your wallets and such ) .\nOut of these 10 wallets , 2 will support `ETH + NFT(s) + ERC-20 Tokens` and rest 8 will only support `ETH + ERC-20 Tokens` . Adding a minimum of 1 wallet is necessary and you can further add upto 9 more !\n\n**Note:** Only the NFT(s) on ETHEREUM MAINNET are supported.");
      const refresh = new MessageEmbed()
        .setTitle("3) Refreshing Data")
        .setColor("#454be9")
        .setDescription("Well , I believe this is the easiest part of using the bot . Under the portfolio , you would see a green button to refresh , just hit it and have your portfolio refreshed !");
      const more = new MessageEmbed()
        .setTitle("4) Something Else")
        .setColor("#454be9")
        .setDescription("➭ Are you facing some issues ?\n➭ Did your subscription not validate ?\n➭ Have some feedback / suggestion ?\n**. . .**\n\nYou are always welcome to join our [discord support server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !') for anything you would like to talk to us regarding the bot !\nWe would love to hear from you !!!");
      const channel = await client.channels.fetch(interaction.channelId);
      if (channel.type === "DM" || channel.type === "GROUP_DM") {
        return interaction.reply({
          embeds: [general, subscription, config, refresh, more],
          ephemeral: true,
        });
      };
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
      const dead_buttons = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId("left")
            .setLabel("❰")
            .setDisabled(true)
            .setStyle("PRIMARY"),
          new MessageButton()
            .setCustomId("right")
            .setLabel("❱")
            .setStyle("PRIMARY")
            .setDisabled(true)
        );
      let counter = 0;
      const sent = await interaction.reply({
        embeds: [general, subscription],
        ephemeral: true,
        components: [row_left],
        fetchReply: true,
      });
      const collector = sent.createMessageComponentCollector({
        componentType: 'BUTTON',
        idle: 90000
      });
      collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
          return i.reply({
            content: "These buttons aren't for you.",
            ephemeral: true,
          });
        };
        await i.deferUpdate();
        if (counter === 0) {
          await interaction.editReply({
            embeds: [config],
            ephemeral: true,
            components: [row_middle],
          });
          ++counter;
          return;
        } else if (counter === 1) {
          if (i.customId === "left") {
            await interaction.editReply({
              embeds: [general, subscription],
              ephemeral: true,
              components: [row_left],
            });
            --counter;
            return;
          } else if (i.customId === "right") {
            await interaction.editReply({
              embeds: [refresh],
              ephemeral: true,
              components: [row_middle],
            });
            ++counter;
            return;
          };
        } else if (counter === 2) {
          if (i.customId === "left") {
            await interaction.editReply({
              embeds: [config],
              ephemeral: true,
              components: [row_middle],
            });
            --counter;
            return;
          } else if (i.customId === "right") {
            await interaction.editReply({
              embeds: [more],
              ephemeral: true,
              components: [row_right],
            });
            ++counter;
            return;
          };
        } else if (counter === 3) {
          await interaction.editReply({
            embeds: [refresh],
            ephemeral: true,
            components: [row_middle],
          });
          --counter;
          return;
        };
      });
      collector.on("end", async (collected) => {
        await interaction.editReply({
          ephemeral: true,
          components: [dead_buttons],
        }).catch((e) => { });
        return;
      });
    } catch (e) {
      console.log(e);
      if (interaction.replied) {
        await interaction.editReply({
          content: "I am facing some issues , the dev has been informed . Please try again in some hours.",
          embeds: null,
          components: null,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "I am facing some issues , the dev has been informed . Please try again in some hours.",
          embeds: null,
          components: null,
          ephemeral: true,
        });
      };
      client.users.cache.get("727498137232736306").send(`Bobot has trouble in help.js -\n\n${e}`);
    };
  },
};