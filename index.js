const fs = require('fs');
const Discord = require('discord.js');
const colors = require('./colors.json');
var timeStamp = require('./lib/timeStamp');
const mongoose = require('mongoose');
const client = new Discord.Client();


//Parse config.json
var data = fs.readFileSync('./config.json');
var config = JSON.parse(data);

const token = config["token"];

if (config["prefix"]) prefix = config["prefix"];
else prefix = "$";
   
global.servers = {};

client.on('ready', () => {
    client.user.setActivity(`${prefix}help`);

    console.log(`${timeStamp.getTimeStamp()} Amaretto herrscht!`)
})

//============== Command Handler ===================
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//=============== Commands ====================
client.on('message', message => {
    let args = message.content.split(" ");
    switch(args[0].toLowerCase()) {
        case prefix + 'ping':
            client.commands.get('ping').execute(message, timeStamp, client);
            break;
        case prefix + 'help':
            client.commands.get('help').execute(message, Discord, colors, client, timeStamp, fs);
            break;
        case prefix + 'hushhush':
            client.commands.get('hushhush').execute(message, args, timeStamp, fs);
            break;
        case prefix + 'roast':
            client.commands.get('roast').execute(message, args, timeStamp, fs);
            break;
        case prefix + 'picture':
            client.commands.get('picture').execute(message, timeStamp, args, Discord, colors, fs);
            break;
        case prefix + 'userinfo':
            client.commands.get('userinfo').execute(message, Discord, colors, client, timeStamp);
            break;
        case prefix + 'serverinfo':
            client.commands.get('serverinfo').execute(message, Discord, colors, client, timeStamp);
            break;
        case prefix + 'clear':
            client.commands.get('clear').execute(message, args, timeStamp, fs);
            break;
        case prefix + 'save':
            client.commands.get('save').execute(message, args, timeStamp, fs);
            break;
        case prefix + 'roll':
            client.commands.get('roll').execute(message, timeStamp, args);
            break;
        case prefix + 'smart':
            client.commands.get('smart').execute(message, timeStamp, args);
            break;
        case prefix + 'haltstop':
            client.commands.get('haltStop').execute(message, timeStamp, args, fs, Discord);
            break;
        case prefix + 'reassignroles':
            client.commands.get('reassignRoles').execute(message, timeStamp, fs);
            break;
    }
})

//MongoDB
mongoose.connect(config["MONGODB_SRV"])
.then(() => {
    console.log(`${timeStamp.getTimeStamp()} Connected to database`);
}).catch((err) => {
    console.log(err);
})

client.login(token);
