const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription("Tosses a coin or a custom sided dice.")
    .addNumberOption(option =>
        option.setName("sides")
        .setDescription('The number of sides the dice should have.')
        .setRequired(false)),
    name: 'roll',
    description: 'Tosses a coin or a custom sided die.',
    async execute(interaction, timeStamp){

        const sides = interaction.options.get("sides");
        
        // Default number of sides is 6
        const max = sides ? sides.value : 6

        if (max <= 0) return await interaction.reply({content : "The number of sides should be positive.", ephemeral: true});

    
        const result = Math.floor(Math.random() * Math.floor(max)) + 1;
        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} rolled a ${result} on a ${max} sided dice.`);
        return await interaction.reply(`**${result}**`);

    }
}