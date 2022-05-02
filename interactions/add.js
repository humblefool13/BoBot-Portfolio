const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const mongoose = require("mongoose");
const free_users = require('../models/freeTrials');
const sub_records = require('../models/subscriptionRecords');

module.exports = {
    name: "add",
    async interact(client, interaction) {
        try {
            if (!interaction.member.roles.cache.has("969173759581904946")) return interaction.reply({
                content: "This command isn't for you.\n\nOnly <@&969173759581904946> can use this command.",
                ephemeral: true
            });
            const user = interaction.options.getUser('user');
            const userid = user.id;
            if (user.bot) return interaction.reply({
                content: "You cannot add subscriptions to bots.",
                ephemeral: true
            });
            const weeks = interaction.options.getInteger('weeks');
            const free = interaction.options.getBoolean('free');
            await interaction.deferReply();
            if (free) {
                const find = await free_users.findOne({
                    discord_id: userid,
                });
                if (find) {
                    return interaction.editReply({
                        content: `The user <@${userid}> has had a free subscription already.`
                    });
                };
                await new free_users({
                    discord_id: userid,
                }).save().catch((e) => {
                    console.log
                });
                const find_sub = await sub_records.findOne({
                    discord_id: userid,
                });
                if (!find_sub) {
                    await new sub_records({
                        discord_id: userid,
                        start_timestamp: interaction.createdTimestamp,
                        weeks: weeks,
                        end_timestamp: interaction.createdTimestamp + weeks * 7 * 24 * 60 * 60 * 1000,
                    }).save().catch((e) => {
                        console.log
                    });
                    return interaction.editReply({
                        content: `The user <@${userid}> has been successfully subscribed on <t:${parseInt(interaction.createdTimestamp/1000)}:F> for ${weeks} weeks and the subscription will end on <t:${parseInt((interaction.createdTimestamp+weeks*7*24*60*60*1000)/1000)}:F>.`
                    }).catch((e) => {
                        console.log
                    });
                } else {
                    const endTimestampOld = find_sub.end_timestamp;
                    find_sub.end_timestamp = endTimestampOld + weeks * 7 * 24 * 60 * 60 * 1000;
                    find_sub.save().then(() => {
                        return interaction.editReply({
                            content: `The subscription for user <@${userid}> which was supposed to end on <t:${parseInt(endTimestampOld/1000)}:F> is now extended to <t:${parseInt((endTimestampOld+weeks*7*24*60*60*1000)/1000)}:F>.`
                        }).catch((e) => {
                            console.log
                        });
                    }).catch((e) => {})
                };
            } else {
                const find_sub = await sub_records.findOne({
                    discord_id: userid,
                });
                if (!find_sub) {
                    await new sub_records({
                        discord_id: userid,
                        start_timestamp: interaction.createdTimestamp,
                        weeks: weeks,
                        end_timestamp: interaction.createdTimestamp + weeks * 7 * 24 * 60 * 60 * 1000,
                    }).save().catch((e) => {
                        console.log
                    });
                    return interaction.editReply({
                        content: `The user <@${userid}> has been successfully subscribed on <t:${parseInt(interaction.createdTimestamp/1000)}:F> for ${weeks} weeks and the subscription will end on <t:${parseInt((interaction.createdTimestamp+weeks*7*24*60*60*1000)/1000)}:F>.`
                    }).catch((e) => {
                        console.log
                    });
                } else {
                    const endTimestampOld = find_sub.end_timestamp;
                    find_sub.end_timestamp = endTimestampOld + weeks * 7 * 24 * 60 * 60 * 1000;
                    find_sub.save().then(() => {
                        return interaction.editReply({
                            content: `The subscription for user <@${userid}> which was supposed to end on <t:${parseInt(endTimestampOld/1000)}:F> is now extended to <t:${parseInt((endTimestampOld+weeks*7*24*60*60*1000)/1000)}:F>.`,
                        }).catch((e) => {
                            console.log
                        });
                    }).catch((e) => {});
                };
            };
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
            client.users.cache.get("727498137232736306").send(`Bobot has trouble add.js -\n\n${e}`);
        };
    }
}