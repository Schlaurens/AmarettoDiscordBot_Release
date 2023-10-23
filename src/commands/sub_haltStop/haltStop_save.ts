import { 
    ChatInputCommandInteraction, 
    GuildMemberRoleManager, 
    UserContextMenuCommandInteraction, 
    GuildMember 
} from 'discord.js';
    
module.exports = {
    name:'haltStop_save',
    async execute(interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction, timeStamp: any, role_backup_model: any, user_command = false) {

        // interaction is either a UserContextMenuCommandInteraction or a ChatInputCommandInteraction depending on user_command
        interaction = user_command ? interaction as UserContextMenuCommandInteraction : interaction as ChatInputCommandInteraction;

        var member = user_command ? (interaction as UserContextMenuCommandInteraction).targetMember : interaction.options.get("member")?.member;
        member = member as GuildMember;
    
        // If no member was found
        if(!member) {
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to backup roles but no member was found. user_command = ${user_command}`);
            return await interaction.reply({content : "No member was found.", ephemeral : true});
        }

        // Collection of all the roles for a given member.
        const roleCollection = (member.roles as GuildMemberRoleManager).cache;
        
        // If the member already has his roles backed up -> delete the backup and save them again
        if(await role_backup_model.exists({user_id : member.id})) {
            await role_backup_model.deleteOne({user_id : member.id});
        } 

        // Create a document and save it
        let role_backup = await role_backup_model.create({
            name : member.user.username,
            displayName: member.displayName,
            user_id : member.id,
            timestamp : timeStamp.getTimeStamp(),
            roles : [...roleCollection.values()]
        })

        await role_backup.save();
        await interaction.reply(`**${member.user.displayName}'s** roles were saved.`);
        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} saved roles for ${member.user.displayName}. user_command = ${user_command}`);
    }
}