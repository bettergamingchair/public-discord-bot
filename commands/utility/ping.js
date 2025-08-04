const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('The ping utility command.'),
    async execute (interaction) {
        await interaction.reply({ content: 'Pong! '})
    }
}