import { 
	Client, 
	ChatInputCommandInteraction,
	SlashCommandBuilder 
} from 'discord.js';

const timeStamp = require('../lib/timeStamp.ts');

module.exports = {
    name: 'ping',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Returns the Ping and API Latency.'),
	async execute(interaction: ChatInputCommandInteraction, client: Client) {

		await interaction.reply(`Ping : **${Date.now() - interaction.createdTimestamp}ms** \nAPI Latency: **${Math.round(client.ws.ping)}ms**`);

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} pinged the bot.`);
	},
};