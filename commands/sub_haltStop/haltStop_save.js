module.exports = {
    name:'haltStop_save',
    async execute(interaction, timeStamp, role_backup_model, user_command) {

        const member = user_command ? interaction.options.getMember("user") : interaction.options.get("member").member;

        // Collection of all the roles for a given member.
        const roleCollection = member.roles.cache;

        // If the member already has his roles backed up -> delete the backup and save them again
        if(await role_backup_model.exists({user_id : member.id})) {
            await role_backup_model.deleteOne({user_id : member.id});
        } 

        // Create a document and save it
        let role_backup = await role_backup_model.create({
            name : member.user.username,
            user_id : member.id,
            timestamp : timeStamp.getTimeStamp(),
            roles : [...roleCollection.values()]
        })

        await role_backup.save();
        await interaction.reply(`**${member.user.username}'s** roles were saved.`);
        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} saved roles for ${member.user.username}. user_command = ${user_command}`);
    }
}