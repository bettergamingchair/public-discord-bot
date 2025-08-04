const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField, ChannelType, ButtonStyle, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('The ticket setup command.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to put the ticket system in.').setRequired(true).addChannelTypes(ChannelType.GuildText)),
    async execute (interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: 'You do not have the permissions to do that.', flags: MessageFlags.Ephemeral });
        }

        const { options, guild } = interaction;
        const channel = options.getChannel('channel');

        const embed = new EmbedBuilder()
            .setTitle('Ticket System')
            .setDescription('Click the "Create Ticket" button to open a private channel to speak with the Staff Team.')
            .setColor('Aqua')

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('button')
                .setLabel('Create Ticket')
                .setEmoji('🎫')
                .setStyle(ButtonStyle.Secondary)
        )

        await channel.send({ embeds: [embed], components: [row] })
        await interaction.reply({ content: 'Ticket system successfuly setup!', flags: MessageFlags.Ephemeral })
    }
}