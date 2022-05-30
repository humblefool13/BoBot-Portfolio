const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "about",
  async interact(client, interaction) {
    try {
      const embed = new MessageEmbed()
        .setTitle("About BoBot")
        .setColor("#454be9")
        .setDescription("hello gm,\nBobot was first created by me ( 0xBo#9999 ) for personal use , there was no plan to publish it back then , I showed it to some friends and everyone liked it and wanted it for themselves , since I had hardcoded everything for my personal needs , I decided to make a public version of the bot and so here you have the result of my efforts !\n\nBobot helps you track your ETH - NFT portfolio in realtime , allows you to add upto 10 wallets , 2 of which will be accounted for NFT(s) and all will be accounted for ETH and supported ERC-20 tokens . To learn more how to use the bot please use the **/help** slash command");
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (e) {
      console.log(e);
      if (interaction.deferred) {
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
      client.users.cache.get("727498137232736306").send(`Bobot has trouble in about.js -\n\n${e}`);
    };
  }
}