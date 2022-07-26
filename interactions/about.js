const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "about",
  async interact(client, interaction) {
    try {
      const embed = new EmbedBuilder()
        .setTitle("About BoBot")
        .setColor("#454be9")
        .setDescription("Bobot helps you track your ETH - NFT portfolio in realtime , allows you to add upto 10 wallets , 2 of which will be accounted for NFT(s) and all will be accounted for ETH and supported ERC-20 tokens . To learn more how to use the bot please use the **/help** slash command");
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (e) {
      console.log(e);
      if (interaction.deferred || interaction.replied) {
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
      client.users.cache.get("727498137232736306").send(`Bobot has trouble in about.js -\n\n${e}`);
    };
  }
}