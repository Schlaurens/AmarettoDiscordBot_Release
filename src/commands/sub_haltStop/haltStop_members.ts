import { 
    ChatInputCommandInteraction, 
    MessageFlags
} from 'discord.js';
import { RoleBackup_Interface } from '../../models/roleBackupSchema';
import type { Model } from 'mongoose';

module.exports = {
    name:'haltStop_members',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, role_backup_model: Model<RoleBackup_Interface>) {

        //If no members in database
        if(await role_backup_model.countDocuments() < 1) {
            return await interaction.reply({content : "The backup is empty.", flags: MessageFlags.Ephemeral});
        }

        // Get backups from database
        const backups = await role_backup_model.find();

        // Get the names and timestamps from all members
        var backed_up_members = "";
        for (var i = 0; i < backups.length; i++) {
            
            var name = backups[i]?.name;
            var displayName = backups[i]?.displayName == name ? undefined : backups[i]?.displayName;
            var timestamp = backups[i]?.timestamp;

            var backed_up_members_displayname = `\n** ${displayName} (${name}) -- ${timestamp} **`;
            var backuped_up_members_no_displayname = `\n** ${name} -- ${timestamp} **`;

            backed_up_members += displayName ? backed_up_members_displayname : backuped_up_members_no_displayname;
        }

        await interaction.reply(backed_up_members);

        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} listed members from Database.`);
    }
}