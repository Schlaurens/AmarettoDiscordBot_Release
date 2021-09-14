module.exports = {
    name:'haltStop_members',
    async execute(message, timeStamp, fs) {

        const role_backup_model = require('../../models/roleBackupSchema');

        //If no members in JSON
        if(!await role_backup_model.exists()) {
            message.channel.send("Das Backup ist leer.")
            return;
        }

        // Get backups from database
        let backups = await role_backup_model.find();
       
        // Get the names and timestamps from all members
        var backed_up_members = "";
        for (var i = 0; i < backups.length; i++) {
            backed_up_members += "\n**" + backups[i]["name"] + " -- " + backups[i]["timestamp"] + "**";
        }

        //print String
        message.channel.send(backed_up_members);

        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} listed members from Database.`);
        return;
    }
}