const { MessageEmbed } = require("discord.js");

module.exports = {
  name : "about",
  async interact (client, interaction) {
    try{
      const embed = new MessageEmbed()
      .setTitle("About BoBot")
      .setColor("#454be9")
      .setDescription("**[hello gm](https://www.youtube.com/shorts/n5JbpiflnIo)**\nIt all started when I ( 0xBo#9999 ) made a bot for myself that would update me every minute about my gains/losses in NFTs and in ETH , I really loved this bot I had made for myself , there was no plan to publish it back then . \nSomedays later , I revealed it to my friends , showed them how I can have real time updates on my entire ethereum + NFT portfolio by staying in Discord and not having to go to an external site . Everyone loved the idea and loved the bot and wanted it for themselves . The original bot was made specifically for myself ( hardcoded eveything ) but I decided to share this amazing thing with fellow degens and made what you have in your server right now !\n\n:question: What does this bot do?\n:small_blue_diamond: This bot helps you track your entire ethereum ( upto 10 wallets ) and NFT ( upto 2 wallets & upto 300 collections *mind you i have tested pranksy's wallet* ) portfolio , almost all NFT communities are built in discord and there are several millions of NFT traders on discord who spend a major part of their everyday on Discord , this bot is an attempt to help them have a better track over their trades , over how their collections are performing and over their overall portfolio.\nUse `/help` slash command to get started!");
      await interaction.reply({
        embeds : [embed],
        ephemeral : true,
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
      client.users.cache.get("727498137232736306").send(`Bobot has trouble about.js -\n\n${e}`);
    };
  }
}