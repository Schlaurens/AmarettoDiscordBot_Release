import { 
    ChatInputCommandInteraction, 
    GuildMember, 
    MessageFlags, 
    PermissionResolvable 
} from 'discord.js';
import type { Model } from 'mongoose';
import { RoleBackup_Interface } from '../../models/roleBackupSchema';

module.exports = {
    name:'haltStop_clear',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, role_backup_model: Model<RoleBackup_Interface>) {
        
        const member = interaction.member as GuildMember;
        //Permission Check
        if(!member?.permissions.has('ADMINISTRATOR' as PermissionResolvable)) {
            await interaction.reply({content : '**Insufficient permissions.**', flags: MessageFlags.Ephemeral});
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