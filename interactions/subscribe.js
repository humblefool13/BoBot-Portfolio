const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = {
  name: "subscribe",
  async interact(client, interaction) {
    /*
        try{
          const step1 = new MessageEmbed()
          .setTitle("Choose a Plan")
          .setColor("#454be9")
          .setDescription("I hope you liked the product and that might be the reason you are here :slight_smile:\nTo start using this product , please choose 1 of the following available plans :\n\n\`\`\`0,05  ETH => 4  Weeks\n0,125 ETH => 12 Weeks\n0,25  ETH => 24 Weeks\n0,5   ETH => 48 Weeks\`\`\`\n:green_circle::red_circle::red_circle::red_circle:");
          const step2 = new MessageEmbed()
          .setTitle("Payment")
          .setColor("#454be9")
          .setDescription("Since you must have chosen a plan , please transfer the required amount of ETH to the wallet sent below.\n\nYou may use the QR code below as well !!! \n\n:green_circle::green_circle::red_circle::red_circle:")
          .setImage("https://media.discordapp.net/attachments/797163839765741568/969700174798663710/IMG_20220430_021135.jpg");
          const step2a = new MessageEmbed()
          .setColor("#454be9")
          .setDescription("0x6FFDd91000823E8989572c6ab95D0875E592659b");
          const step3 = new MessageEmbed()
          .setTitle("Generating Proof of Wallet Ownership")
          .setColor("#454be9")
          .setDescription("We need to verify the wallet sending the subscription fee belongs to you . Please head over to https://etherscan.io/verifiedSignatures and sign a message ( hit the \"Sign Message\" button ) stating your discord account full username ( eg : \"0xBo#9999\")  with wallet you did the transaction with . Click on the \"Publish\" button and this should redirect you to your signature message page \( [this for me](https://etherscan.io/verifySig/6483) \) just copy this link you would need it later !!! If by chance you lose the link , do not worry you can always find it [in here](https://etherscan.io/verifiedSignatures) . \n\n**NOTE : This will not trigger a blockchain transaction and will not cost any gas fee . It is completely safe , however its recommended to \"Disconnect\" the site from your wallet after use.** \n\n:green_circle::green_circle::green_circle::red_circle:");
          const step4 = new MessageEmbed()
          .setTitle("Redeem the Purchase")
          .setColor("#454be9")
          .setDescription("Join our [discord support server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !') , make a ticket and share the signature link you got in last step.\nThat's all , enjoy the service !!! Hope it helps keep track of your trades :wink:\n\n:green_circle::green_circle::green_circle::green_circle:");
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
          interaction.reply({
            embeds : [step1],
            components : [row_left],
            fetchReply: true
          }).then((sent)=>{
            const collector = sent.createMessageComponentCollector({ componentType: 'BUTTON', idle: 60000 });
            collector.on("collect",async(i)=>{
              if(i.user.id!==interaction.user.id){
                return i.reply({
                  content : "These buttons aren't for you.",
                  ephemeral  :true,
                });
              };
              await i.deferUpdate();
              if(counter===0){
                await interaction.editReply({
                  embeds : [step2,step2a],
                  components : [row_middle],
                });
                ++counter;
                return;
              }else if(counter===1){
                if(i.customId==="left"){
                  await interaction.editReply({
                    embeds : [step1],
                    components : [row_left],
                  });
                  --counter;
                  return;
                }else if(i.customId==="right"){
                  await interaction.editReply({
                    embeds : [step3],
                    components : [row_middle],
                  });
                  ++counter;
                  return;
                };
              }else if(counter===2){
                if(i.customId==="left"){
                  await interaction.editReply({
                    embeds : [step2,step2a],
                    components : [row_middle],
                  });
                  --counter;
                  return;
                }else if(i.customId==="right"){
                  await interaction.editReply({
                    embeds : [step4],
                    components : [row_right],
                  });
                  ++counter;
                  return;
                };
              }else if(counter===3){
                await interaction.editReply({
                  embeds : [step3],
                  components : [row_middle],
                });
                --counter;
                return;
              };
            });
            collector.on("end",async(collected)=>{
              await interaction.editReply({
                components : [dead_buttons],
              }).catch((e)=>{});
              return;
            });
          });
          
        }catch(e){
          console.log(e);
          if(interaction.replied){
            await interaction.editReply({
              content : "I am facing some issues , the dev has been informed . Please try again in some hours.",
              embeds : null,
              components : null,
            });
          } else {
            await interaction.reply({
              content : "I am facing some issues , the dev has been informed . Please try again in some hours.",
              embeds : null,
              components : null,
            });
          };
          client.users.cache.get("727498137232736306").send(`Bobot has trouble subscribe.js -\n\n${e}`);
        };
      */
    const embed = new MessageEmbed()
      .setDescription("Join our [Discord Support Server](https://discord.gg/KFp3dgGQwC 'Click to join the support server !') and make a ticket to purchase a subscription !!!")
      .setColor("#454be9");
    interaction.reply({
      embeds: [embed],
    });
  }
}