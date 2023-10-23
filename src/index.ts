import { 
    ChatInputCommandInteraction, 
    UserContextMenuCommandInteraction,
    Events,
    GatewayIntentBits,
    Partials,
    REST
} from "discord.js";

const { 
    Client,
    Collection, 
} = require('discord.js');

const { Routes } = require('discord-api-types/v10');
var timeStamp = require('./lib/timeStamp');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.GuildVoiceStates
    ], 
    partials: [
        Partials.Channel
    ]
});
let commands: typeof Collection = [];

//Parse config.json
var data: string = fs.readFileSync(path.join(__dirname, '../config.json'));
var config: any = JSON.parse(data);

// const token = config["token"]; //<--- Your token here
const token = config["testToken"]; //<--- Test token

client.on('ready', () => {
    client.user.setActivity(`in deiner Wand`);
    console.log(`${timeStamp.getTimeStamp()} Amaretto herrscht!`)
})

//============== Command Handler ===================
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname ,'/commands/')).filter((file: string) => file.endsWith('.ts'));
for(const file of commandFiles) {
    const command = require(path.join(__dirname, `./commands/${file}`));
    client.commands.set(command.name, command);

    commands.push(command.data);

    //for User Commands
    if(command.user_command) commands.push(command.user_command);
}

// Slash Commands
const guildId: string = config["guildId_test"]; //<-- For Development
const clientId: string = config["clientId_test"]; //<-- Test Client
// const clientId: string = config["clientId"]; //<-- Main Client

const rest = new REST({ version: '10' }).setToken(token);
(async () => {
	try {
		console.log(`${timeStamp.getTimeStamp()} Started refreshing application (/) commands.`);
		await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), // <-- For Development
			// Routes.applicationCommands(clientId),
			{body : commands} ,
		);

		console.log(`${timeStamp.getTimeStamp()} Successfully reloaded application (/) commands.`);
	} catch (error: unknown) {
		console.error(error);
	}
})();

client.on(Events.InteractionCreate, async (interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction) => {

    if (interaction.isChatInputCommand()) {;
        if (interaction.commandName === 'ping') await client.commands.get('ping').execute(interaction, client);
        if (interaction.commandName === 'clear') await client.commands.get('clear').execute(interaction, timeStamp);
        if (interaction.commandName === 'reassignroles') await client.commands.get('reassignRoles').execute(interaction);
        if (interaction.commandName === 'hushhush') await client.commands.get('hushhush').execute(interaction);
        if (interaction.commandName === 'roll') await client.commands.get('roll').execute(interaction);
        if (interaction.commandName === 'serverinfo') await client.commands.get('serverinfo').execute(interaction);
        if (interaction.commandName === 'userinfo') await client.commands.get('userinfo').execute(interaction);
        if (interaction.commandName === 'haltstop') await client.commands.get('haltStop').execute(interaction);
        if (interaction.commandName === 'smart') await client.commands.get('smart').execute(interaction);
        if (interaction.commandName === 'picture') await client.commands.get('picture').execute(interaction, client);
        if (interaction.commandName === 'roast') await client.commands.get('roast').execute(interaction, client);
        if (interaction.commandName === 'help') await client.commands.get('help').execute(interaction, client, commands);
        if (interaction.commandName === 'permissions') await client.commands.get('permissions').execute(interaction);
        if (interaction.commandName === 'avatar') await client.commands.get('avatar').execute(interaction);
        if (interaction.commandName === 'update') await client.commands.get('update').execute(interaction, client);
    }
    // For User Commands
    else if (interaction.isUserContextMenuCommand()) {
        var user_command = true;
        if (interaction.commandName === 'Avatar') await client.commands.get('avatar').execute(interaction, user_command);
        if (interaction.commandName === 'HushHush') await client.commands.get('hushhush').execute(interaction, user_command);
        if (interaction.commandName === 'Info') await client.commands.get('userinfo').execute(interaction, user_command);
        if (interaction.commandName === 'HaltStop') await client.commands.get('haltStop').execute(interaction, user_command);
        if (interaction.commandName === 'Permissions') await client.commands.get('permissions').execute(interaction, user_command);
    }
    else return;
});

//MongoDB
mongoose.connect(config["MONGODB_SRV"])
.then(() => {
    console.log(`${timeStamp.getTimeStamp()} Connected to database`);
}).catch((err: unknown) => {
    console.log(err);
})

client.login(token);
