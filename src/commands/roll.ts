import { 
    SlashCommandIntegerOption,
    ChatInputCommandInteraction,
    SlashCommandBuilder 
} from 'discord.js';

const timeStamp = require('../lib/timeStamp.ts');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription("Tosses a coin or a custom sided dice.")
    .addIntegerOption((option: SlashCommandIntegerOption) =>
        option.setName("sides")
        .setMinValue(1)
        .setDescription('The number of sides the dice should have.')
        .setRequired(false)),
    name: 'roll',
    description: 'Tosses a coin or a custom sided die.',
    async execute(interaction: ChatInputCommandInteraction){

        const sides = interaction.options.getInteger('sides');

        // Default number of sides is 6
        const max: number = sides ? sides : 6;

        const result = Math.floor(Math.random() * Math.floor(max)) + 1;
        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} rolled a ${result} on a ${max} sided dice.`);
        return await interaction.reply(`**${result}**`);
    }
}