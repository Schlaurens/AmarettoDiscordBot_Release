module.exports = {
    name: 'haltStop',
    description: 'saves all the Roles of a given user in database.',
    async execute(message, timeStamp, args, fs, Discord){
        
        //Used to check permissions of a given member
        const permissions = require('../lib/permissions');
        const role_backup_model = require('../models/roleBackupSchema');


        //Permission Check
        if(!permissions.check_permissions("haltStop", message.member)) {
            message.channel.send('Insufficient permissions.');
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to backup roles but has insufficient permissions`);
            return;
        }

        //==== Command Handler ====
        var subcommands = new Discord.Collection();
        const subcommandFiles = fs.readdirSync('./commands/sub_haltStop/').filter(file => file.endsWith('.js'));
        for (const file of subcommandFiles) {
            const command = require(`./sub_haltStop/${file}`);
            subcommands.set(command.name, command);
        }
        
        //Checks, whether a user was specified.
        if (!message.mentions.users.first()) {
            
            //Print out the members + timestamp in JSON Backup 
            if (args[1] && (args[1].toLowerCase() === "--members" || args[1].toLowerCase() === "-m")) {

                subcommands.get('haltStop_members').execute(message, timeStamp, fs);
                return;
            }
            //Deletes the JSON file
            else if (args[1] && args[1].toLowerCase() === "--clear") {

                subcommands.get('haltStop_clear').execute(message, timeStamp, fs);
                return;
            }

            message.channel.send("Brauche 'nen Benutzernamen.");
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to backup roles but no user was specified.`)
            return;
        }
        
        var member = message.mentions.members.first();

        //Collection of all the roles for a given member.
        var roleCollection = member.roles.cache;

        // If the member already has his roles backed up -> delete the backup and save them again
        if(await role_backup_model.exists({user_id : member.id})) {
            await role_backup_model.deleteOne({user_id : member.id});
        } 

        // create a document and save it
        let role_backup = await role_backup_model.create({
            name : member.user.username,
            user_id : member.id,
            timestamp : timeStamp.getTimeStamp(),
            roles : roleCollection.array()
        })

        await role_backup.save();
        message.channel.send(`Die Rollen von ${member.user.username} wurden gespeichert.`);
        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} saved roles for ${member.user.username}`);
    }
}