const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reassignroles')
    .setDescription("Recovers the roles of a given user from a role backup.")
    .addUserOption(option => 
        option.setName("member")
        .setDescription('User whose roles you want to recover.')
        .setRequired(true)),
    name: 'reassignRoles',
    description: 'Recovers the roles of a given user from a role backup.',
    async execute(interaction, timeStamp){
        
        //Used to check permissions of a given member
        const permissions = require('../lib/permissions');

        const role_backup_model = require('../models/roleBackupSchema');

        //Check permissions
        if(!permissions.check_permissions("reassignRoles", interaction.member)) {
            await interaction.reply({content : "**Insufficient permissions.**", ephemeral: true});
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} tried to reassign roles but has insufficient permissions`);
            return;
        }

        // get member from options
        const member = interaction.options.get("member").member;

        // Check whether the member has a backup
        if(!await role_backup_model.exists({user_id : member.id})) {
            await interaction.reply({content: `**${member.user.username}'s roles are not backed up.**`, ephemeral:true})
            return;
        }

        // Get backed up roles from Database
        const raw_data = await role_backup_model.findOne({user_id : member.id}).lean();
        // Put only the role IDs into an array 
        roleArray = raw_data["roles"].map(x => x.id)

        // Reassign roles
        member.roles.set(roleArray)
        .then(member => interaction.reply(`**${member.user.username}'s** roles were restored.`))
        .catch(console.error);

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} recovered the roles of ${member.user.username}.`);
    }
}