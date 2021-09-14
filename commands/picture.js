module.exports = {
    name: 'picture',
    description: 'Posts pictures from the database',
    async execute(message, timeStamp, args, Discord, colors, fs) {

        const permissions = require('../lib/permissions');
        const pictures_model = require('../models/picturesSchema');

        //==== Command Handler ====
        var subcommands = new Discord.Collection();
        const subcommandFiles = fs.readdirSync('./commands/sub_picture/').filter(file => file.endsWith('.js'));
        for (const file of subcommandFiles) {
            const command = require(`./sub_picture/${file}`);
            subcommands.set(command.name, command);
        }

        let pictures_count = await pictures_model.count();

        //Send a specified picture (search by index)
        if (args[1] && !isNaN(args[1]) && args[1] < pictures_count) {
            
            let picture = await pictures_model.findOne().skip(args[1]);

            message.channel.send(picture["url"]);

            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} requested a picture and got: ${picture["name"]}`);
        }
        //Send the list of all pictures
        else if (args[1] && (args[1].toLowerCase() === "--file" || args[1].toLowerCase() === "-f")) {

            subcommands.get('picture_file').execute(message, timeStamp);
        }
        //Send the number of all pictures
        else if (args[1] && (args[1].toLowerCase() === "--number" || args[1].toLowerCase() === "-n")) {

            subcommands.get('picture_number').execute(message, timeStamp);
        }
        //Removes the picture at the given index.
        else if (args[1] && (args[1].toLowerCase() === "--remove" || args[1].toLowerCase() === "-r")) {
            subcommands.get('picture_remove').execute(message, args, timeStamp, permissions);

        }

        //Send a specified picture (search by name)
        else if (args[1] && isNaN(args[1])) {

            var re = new RegExp(args[1].toLowerCase());
             
            search_by_name(re, args[1], async (i) => {
                if (i !== undefined) {
                    message.channel.send(i["url"]);
                    console.log(`${timeStamp.getTimeStamp()} ${message.author.username} requested a picture and got: ${i["name"]}`);
                    return;
                }
                message.channel.send("Nichts gefunden.");
            });
        }

        //Send a random picture
        else {

            var random = Math.floor(Math.random() * pictures_count);

            // Get picture from database
            let picture = await pictures_model.findOne().skip(random);

            // Send picture
            message.channel.send(picture["url"]);
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} requested a picture and got: ${picture["name"]}`);
        }


        //======== Functions ========
        /**
         * Search a picture with RegEx
         * @param {*} re the given RegEx
         * @param {*} callback callback function called with the picture's index.
         */
        async function search_by_name(re, name, callback) {

            const pictures_model = require('../models/picturesSchema')

            if (await pictures_model.exists({name : { $regex: new RegExp('^'+ name + '$', "i")}})) {
                return callback(await pictures_model.findOne({name : { $regex: new RegExp('^'+ name + '$', "i")}}));

            }

            if(await pictures_model.exists({name : {$regex: re}})) {
                return callback(await pictures_model.findOne({name : {$regex: re}}));
            }
            return callback();
        }
    }
}