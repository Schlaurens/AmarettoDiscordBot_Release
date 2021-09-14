module.exports = {
    name: 'reassignRoles',
    description: 'Recovers the roles of a given user from roleBackup.json',
    async execute(message, timeStamp, fs){
        
        //Used to check permissions of a given member
        const permissions = require('../lib/permissions');
        const role_backup_model = require('../models/roleBackupSchema');

        //Check permissions
        if(!permissions.check_permissions("reassignRoles", message.member)) {
            message.channel.send('Insufficient permissions.');
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to reassign roles but has insufficient permissions`);
            return;
        }

        //If no user is specified
        if (!message.mentions.members.first()) {
            message.channel.send("Brauche 'nen Benutzernamen.");
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to reassign roles but no user was specified.`);
            return;
        }

        let member = message.mentions.members.first();

        // Check whether the member has a backup
        if(!await role_backup_model.exists({user_id : member.id})) {
            message.channel.send(`${member.user.username}'s Rollen befinden sich nicht im Backup.`);
            return;
        }

        // Get backed up roles from Database
        raw_data = await role_backup_model.findOne({user_id : member.id}).lean();
        // Put only the role IDs into an array 
        roleArray = raw_data["roles"].map(x => x.id)

        // Reassign roles
        member.roles.set(roleArray)
        .then(member => message.channel.send(`${member.user.username}'s Rollen wurden wiederhergestellt.`))
        .catch(console.error);

        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} recovered the roles of ${member.user.username}.`);
    }
}