const fs = require('fs');
const Discord = require('discord.js');
const {Client, Intents} = require('discord.js')
const colors = require('./colors.json');
var timeStamp = require('./lib/timeStamp');
const mongoose = require('mongoose');
const client = new Discord.Client({intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES]});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
let commands = [];


//Parse config.json
var data = fs.readFileSync('./config.json');
var config = JSON.parse(data);

const token = config["token"];


global.servers = {};

client.on('ready', () => {
    client.user.setActivity(`mit deiner Mudda 187 | /help`);

    console.log(`${timeStamp.getTimeStamp()} Amaretto herrscht!`)
})

//============== Command Handler ===================
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);

    commands.push((command.data))
}

// Slash Commands
//const guildId = ''; //<-- For Development
//const clientId = ''; //<-- Test Client
const clientId = config['clientId']; //<-- Main Client
const rest = new REST({ version: '9' }).setToken(token);
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
            //Routes.applicationGuildCommands(clientId, guildId), // <-- For Development
			Routes.applicationCommands(clientId),
			 {body : commands} ,
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    
	if (interaction.commandName === 'ping') await client.commands.get('ping').execute(interaction, timeStamp, client);
	if (interaction.commandName === 'clear') await client.commands.get('clear').execute(interaction, timeStamp);
    if (interaction.commandName === 'reassignroles') await client.commands.get('reassignRoles').execute(interaction, timeStamp);
    if (interaction.commandName === 'hushhush') await client.commands.get('hushhush').execute(interaction, timeStamp, fs);
    if (interaction.commandName === 'roll') await client.commands.get('roll').execute(interaction, timeStamp);
    if (interaction.commandName === 'serverinfo') await client.commands.get('serverinfo').execute(interaction, Discord, colors, timeStamp);
    if (interaction.commandName === 'userinfo') await client.commands.get('userinfo').execute(interaction, Discord, colors, timeStamp);
    if (interaction.commandName === 'haltstop') await client.commands.get('haltStop').execute(interaction, timeStamp, fs, Discord);
    if (interaction.commandName === 'smart') await client.commands.get('smart').execute(interaction, timeStamp);
    if (interaction.commandName === 'picture') await client.commands.get('picture').execute(interaction, timeStamp, Discord, client, fs);
    if (interaction.commandName === 'roast') await client.commands.get('roast').execute(interaction, timeStamp, client, fs);
    if (interaction.commandName === 'help') await client.commands.get('help').execute(interaction, Discord, colors, client, timeStamp, commands);
});

//MongoDB
mongoose.connect(config["MONGODB_SRV"])
.then(() => {
    console.log(`${timeStamp.getTimeStamp()} Connected to database`);
}).catch((err) => {
    console.log(err);
})

client.login(token);
