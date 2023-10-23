import { 
    SlashCommandUserOption, 
    GuildMember, 
    ChatInputCommandInteraction,
    SlashCommandBuilder 
} from 'discord.js';

const timeStamp = require('../lib/timeStamp.ts');
const permissions = require('../lib/permissions.ts');
const role_backup_model = require('../models/roleBackupSchema.ts');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reassignroles')
    .setDescription("Recovers the roles of a given user from a role backup.")
    .addUserOption((option: SlashCommandUserOption) => 
        option.setName("member")
        .setDescription('User whose roles you want to recover.')
        .setRequired(true))
        .setDMPermission(false),
    name: 'reassignRoles',
    description: 'Recovers the roles of a given user from a role backup.',
    async execute(interaction: ChatInputCommandInteraction){

        //Check permissions
        if(!permissions.check_permissions("reassignRoles", interaction.member)) {
            await interaction.reply({content : "**Insufficient permissions.**", ephemeral: true});
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to reassign roles but has insufficient permissions`);
            return;
        }
        // get member from options
        const member = interaction.options.get("member")?.member as GuildMember;
        if(!member) return;

        // Check whether the member has a backup
        if(!await role_backup_model.exists({user_id : member.id})) {
            await interaction.reply({content: `**${member.displayName}'s roles are not backed up.**`, ephemeral:true})
            return;
        }

        // Get backed up roles from Database
        const raw_data = await role_backup_model.findOne({user_id : member.id}).lean();
        // Put only the role IDs into an array 
        var roleArray = raw_data["roles"].map((x: any) => x.id)

        // Reassign roles
        member.roles.set(roleArray)
        .then((member: GuildMember) => interaction.reply(`**${member.displayName}'s** roles were restored.`))
        .catch(console.error);

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} recovered the roles of ${member.displayName}.`);
    }
}