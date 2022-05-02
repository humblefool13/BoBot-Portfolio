const Discord = require("discord.js");

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        let command = "";
        try {
            if (interaction.isCommand()) {
                command = interaction.commandName;
            } else if (interaction.isButton() && interaction.customId === "refresh") {
                command = interaction.customId;
            } else {
                return;
            };
            client.interactions.get(command).interact(client, interaction);
        } catch (e) {
            console.log(e);
            interaction.reply({
                content: "I am having some trouble , the dev has been informed about it. Please try again in some hours.",
                ephemeral: true,
            }).then(() => {
                client.users.cache.get("727498137232736306").send(`Bobot has trouble interactionCreate.js -\n\n${e}`);
            });
        };
    }, //execute
};