const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
  name: "help",
  async interact(client, interaction) {
    try {
      const general = new EmbedBuilder()
        .setTitle("BoBot Help")
        .setColor("#8A45FF")
        .setDescription("The Bot comes with the following commands :\n`/about` : About the Bot\n`/config` : To setup your wallets \n`/help` : This command\n`/subscribe` : Learn more about subscriptions");
      const subscription = new EmbedBuilder()
        .setTitle("1) Subscription")
        .setColor("#8A45FF")
        .setDescription("To use the BoBot , you would first need a valid subscription . To learn more about subscriptions use the `/subscribe` slash command .");
      const config = new EmbedBuilder()
        .setTitle("2) Configuring Wallets")
        .setColor("#8A45FF")
        .setDescription("You can have a total of 10 wallets per discord account . This will be saved using the \`/config\` slash command .\nHowever , the overall portfolio will be based on all your wallets together ( you cannot have two portfolios splitting your wallets and such ) .\nOut of these 10 wallets , 2 will support `ETH + NFT(s) + ERC-20 Tokens` and rest 8 will only support `ETH + ERC-20 Tokens` . Adding a minimum of 1 wallet is necessary and you can further add upto 9 more !\n\n**Note:** Only the NFT(s) on ETHEREUM MAINNET are supported.");
      const refresh = new EmbedBuilder()
        .setTitle("3) Refreshing Data")
        .setColor("#8A45FF")
        .setDescription("Well , I believe this is the easiest part of using the bot . Under the portfolio , you would see a green button to refresh , just hit it and have your portfolio refreshed !");
      const more = new EmbedBuilder()
        .setTitle("4) Something Else")
        .setColor("#8A45FF")
        .setDescription("➭ Are you facing some issues ?\n➭ Did your subscription not validate ?\n➭ Have some feedback / suggestion ?\n**. . .**\n\nYou are always welcome to join our [discord support server](https://discord.gg/HweZtrzAnX 'Click to join the support server !') for anything you would like to talk to us regarding the bot !\nWe would love to hear from you !!!");
      const channel = await client.channels.fetch(interaction.channelId);
      if (channel.type === ChannelType.DM) {
        return interaction.reply({
          embeds: [general, subscription, config, refresh, more],
          ephemeral: true,
        });
      };
      const row_left = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("left")
            .setLabel("❰")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("right")
            .setLabel("❱")
            .setStyle(ButtonStyle.Primary)
        );
      const row_middle = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("left")
            .setLabel("❰")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("right")
            .setLabel("❱")
            .setStyle(ButtonStyle.Primary)
        );
      const row_right = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("left")
            .setLabel("❰")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("right")
            .setLabel("❱")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
        );
      const dead_buttons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("left")
            .setLabel("❰")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("right")
            .setLabel("❱")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
        );
      let counter = 0;
      const sent = await interaction.reply({
        embeds: [general, subscription],
        ephemeral: true,
        components: [row_left],
        fetchReply: true,
      });
      const filter = int => int.user.id === interaction.user.id;
      const collector = sent.createMessageComponentCollector({
        filter,
        componentType: ComponentType.Button,
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
      client.users.cache.get("727498137232736306").send(`${client.user.username} has trouble in help.js -\n\n${e}`);
    };
  }
}