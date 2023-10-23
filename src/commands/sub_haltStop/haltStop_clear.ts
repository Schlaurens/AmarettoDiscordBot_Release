import { 
    ChatInputCommandInteraction, 
    GuildMember, 
    PermissionResolvable 
} from 'discord.js';

module.exports = {
    name:'haltStop_clear',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, role_backup_model: any) {
        
        const member = interaction.member as GuildMember;
        //Permission Check
        if(!member?.permissions.has('ADMINISTRATOR' as PermissionResolvable)) {
            await interaction.reply({content : '**Insufficient permissions.**', ephemeral : true});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to backup roles but has insufficient permissions`);
        }

        try{
            // Delete all documents in the database
            await role_backup_model.deleteMany();
            await interaction.reply("The backup has been cleared.");
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} cleared the backup.`);
        }
        catch (err) {
            console.log(err);
        }

        return;
    }
}