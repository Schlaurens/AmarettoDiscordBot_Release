module.exports = {
    name:'haltStop_clear',
    async execute(interaction, timeStamp, role_backup_model) {
        
        //Permission Check
        if(!interaction.member.permissions.has('ADMINISTRATOR')) {
            await interaction.reply({content : '**Insufficient permissions.**', ephemeral : true});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} tried to backup roles but has insufficient permissions`);
        }

        try{
            // Delete all documents in the database
            await role_backup_model.deleteMany();
            await interaction.reply("The backup has been cleared.");
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} cleared the backup.`);
        }
        catch (err) {
            console.log(err);
        }

        return;
    }
}