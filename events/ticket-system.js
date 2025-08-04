const { Events, MessageFlags, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const transcriptId  = 'TRANSCRIPT_CHANNEL_ID'

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        const { guild } = interaction;
        if (interaction.isButton()) {
            const customId = interaction.customId;

            if (customId === 'button') {
                const category = 'TICKET_CATEGORY_ID'
                const existingTicket = interaction.guild.channels.cache.find(channel => channel.name === `ticket-${interaction.user.username}`);
                if (existingTicket) {
                    return interaction.reply({ content: `You already have a ticket open.`, flags: MessageFlags.Ephemeral })
                }

                const channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    parent: category,
                    type: ChannelType.GuildText,
                    permsissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ['ViewChannel']
                        },
                        {
                            id: interaction.user.id,
                            allow: ['ViewChannel']
                        },
                    ],
                });

                const embed = new EmbedBuilder()
                    .setTitle('Ticket Opened')
                    .setDescription('Please explain what you need below.')
                    .setColor('Aqua')

                const button = new ButtonBuilder()
                    .setCustomId('close-button')
                    .setLabel('Close Ticket')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Danger)

                const row = new ActionRowBuilder().addComponents(button)
                await channel.send({ 
                    embeds: [embed],
                    components: [row],
                    content: `<@${interaction.user.id}>`
                });

                await interaction.reply({
                    content: `Ticket created: ${channel}`, flags: MessageFlags.Ephemeral
                });
            }
        }

        if (interaction.isButton()) {
            const channel = interaction.channel;
            const customId = interaction.customId;

            const attachment = await discordTranscripts.createTranscript(channel, {
                limit: -1,
                returnType: 'attachment',
                filename: `ticket-${interaction.user.username}.html`,
                saveImages: false,
                poweredBy: true,
            })

            if (customId === 'close-button') {
                const embed = new EmbedBuilder()
                    .setTitle('Ticket Closing')
                    .setDescription('This ticket will be closed in 3 seconds...')
                    .setColor('Red')

                await channel.send({ embeds: [embed] });
                await interaction.reply({
                    content: 'Started closing...'
                })
                setTimeout(() => {
                    channel.delete();
                }, 3000);

                 const dmEmbed = new EmbedBuilder()
                    .setTitle('Ticket Closed')
                    .setDescription('Attached below is the HTML Transcript of the ticket you opened.')
                    .setColor('Aqua')

                const transcriptEmbed = new EmbedBuilder()
                    .setTitle('Ticket Closed')
                    .setDescription(`Attached below is the HTML Transcript of one of the tickets opened by <@${interaction.user.id}>`)
                    .setColor('Aqua')

                await interaction.user.send({
                    embeds: [dmEmbed],
                    files: [attachment]
                }).then(interaction => console.log(`Sent HTML Transcript to user.`)).catch(console.error);
                const transcriptChannel = guild.channels.cache.get(transcriptId);
                await transcriptChannel.send({
                    embeds: [transcriptEmbed],
                    files: [attachment]
                })
            }
        }
    }
}