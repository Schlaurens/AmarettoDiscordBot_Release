module.exports = {
    name:'haltStop_members',
    async execute(interaction, timeStamp, role_backup_model) {

        //If no members in database
        if(!await role_backup_model.exists()) {
            return await interaction.reply({content : "The backup is empty.", ephemeral: false});
        }

        // Get backups from database
        const backups = await role_backup_model.find();
       
        // Get the names and timestamps from all members
        var backed_up_members = "";
        for (var i = 0; i < backups.length; i++) {
            backed_up_members += "\n**" + backups[i]["name"] + " -- " + backups[i]["timestamp"] + "**";
        }

        await interaction.reply(backed_up_members);

        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} listed members from Database.`);
    }
}