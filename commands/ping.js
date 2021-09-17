const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'ping',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Returns the Ping and the API Latency.'),
	async execute(interaction, timeStamp, client) {
		await interaction.reply(`Ping : **${Date.now() - interaction.createdTimestamp}ms** \nAPI Latency: **${Math.round(client.ws.ping)}ms**`);

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} pinged the bot`);
        
	},
};