module.exports = {
    name:'haltStop_clear',
    async execute(message, timeStamp, fs) {
        
        const role_backup_model = require('../../models/roleBackupSchema');

        //Permission Check
        if(!message.member.permissions.has('ADMINISTRATOR')) {
            message.channel.send('Insufficient permissions.');
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to backup roles but has insufficient permissions`);
            return;
        }

        try{
            // Delete all documents in the database
            await role_backup_model.deleteMany();
            message.channel.send("Das Backup wurde gelöscht.");
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} cleared the backup.`);
        }
        catch (err) {
            console.log(err);
        }

        return;
    }
}