module.exports = {
    name: 'roast',
    description: 'Roasts a certain person using a database',
    async execute(message, args, timeStamp, fs) {

        const Discord = require('discord.js')
        const permissions = require('../lib/permissions');
        const roast_model = require('../models/roastSchema');

        //==== Command Handler ====
        var subcommands = new Discord.Collection();
        const subcommandFiles = fs.readdirSync('./commands/sub_roast/').filter(file => file.endsWith('.js'));
        for (const file of subcommandFiles) {
            const command = require(`./sub_roast/${file}`);
            subcommands.set(command.name, command);
        }

        let roast_size = await roast_model.count();

        //Roast the author of message
        if (!args[1]) { 

            var author = message.author.username;
            var random = Math.floor(Math.random() * roast_size);
            let roast_sentence = await get_roast(random);

            message.channel.send(roast_sentence["roast"].replace('$name$', author));
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} roasted himself/herself. Index: ${random}`);

        } 
        else if (args[1].toLowerCase() === "-f" || args[1].toLowerCase() === "--file") {

            subcommands.get('roast_file').execute(message, timeStamp, args, fs, roast_model);
        } 
        else if (args[1].toLowerCase() === "--add") {

            subcommands.get('roast_add').execute(message, timeStamp, args, fs, permissions, roast_model);
        }
        else if (args[1].toLowerCase() === "--remove" || args[1].toLowerCase() === "-r") {

            subcommands.get('roast_remove').execute(message, timeStamp, args, permissions, roast_model);
        } 
        // else if (args[1].toLowerCase() === "--upload") {

        //     subcommands.get('roast_upload').execute(message, timeStamp, permissions, fs, json_tools);
        // }
        // Roast the mentioned person
        else if (message.mentions.users.first()) {

            var mentionName = message.mentions.users.first().username;
            var mentionNameUpperCase = mentionName.replace(mentionName.substring(0, 1), mentionName.substring(0, 1).toUpperCase());

            var random = Math.floor(Math.random() * roast_size);
            let roast_sentence = await get_roast(random);

            message.channel.send(roast_sentence["roast"].replace('$name$', mentionNameUpperCase));
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} roasted ${mentionNameUpperCase} (Mention). Index: ${random}`);
        }

        //Roast the specified person
        else {

            var personUp = args[1].replace(args[1].substring(0, 1), args[1].substring(0, 1).toUpperCase()); //Make first letter of uppercase
            var random = Math.floor(Math.random() * roast_size);

            let roast_sentence = await get_roast(random);
            message.channel.send(roast_sentence["roast"].replace('$name$', personUp));

            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} roasted ${personUp} (no Mention). Index: ${random}`);
        }


        //==== Functions ====
        /**
         * Returns the roast at the given index out of the database 
         * @param {*} index a random index
         * @returns the roast at the given index
         */
        async function get_roast(index) {
            try{
                let roast = await roast_model.findOne().skip(index);

                return roast;
            }
            catch(err) {
                console.log(err);
            }
        }
    }
}