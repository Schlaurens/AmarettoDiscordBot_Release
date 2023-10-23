import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder 
} from 'discord.js';

const timeStamp = require('../lib/timeStamp.ts');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('smart')
    .setDescription("Shows a picture of the smartest man alive."),
    name: 'smart',
    description: 'Shows a picture of the smartest man alive.',
    async execute(interaction: ChatInputCommandInteraction){

        await interaction.reply({files: [path.join(__dirname, '../assets/smart/cursedheimer.png')]});

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} used /smart`);
    }
}