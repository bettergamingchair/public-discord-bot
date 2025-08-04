const { SlashCommandBuilder, PermissionsBitField, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('The purge moderation command.')
        .addIntegerOption(option => option.setName('amount').setDescription('The amount of messages to purge.').setRequired(true)),
    async execute (interaction) {
        const { options, guild } = interaction;
        const amount = options.getInteger('amount');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', flags: MessageFlags.Ephemeral })
        }

        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'You need to input a number between 1 and 100.', flags: MessageFlags.Ephemeral });
        }

        await interaction.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            return interaction.reply({ content: 'There was an error trying to purge messages in this channel.', flags: MessageFlags.Ephemeral });
        });

        return interaction.reply({ content: `Successfully deleted ${amount} messages.`, flags: MessageFlags.Ephemeral });
    }
}