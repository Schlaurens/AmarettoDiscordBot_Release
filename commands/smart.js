const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('smart')
    .setDescription("Shows a picture of the smartest man alive."),
    name: 'smart',
    description: 'Shows a picture of the smartest man alive.',
    async execute(interaction, timeStamp){

        await interaction.reply({files: ['./assets/smart/cursedheimer.png']});

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} used /smart`);
    }
}