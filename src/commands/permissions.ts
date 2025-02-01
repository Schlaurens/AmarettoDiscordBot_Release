import { 
    SlashCommandUserOption, 
    SlashCommandBuilder, 
    UserContextMenuCommandInteraction, 
    ChatInputCommandInteraction, 
    GuildMember, 
    PermissionResolvable, 
    MessageFlags
} from "discord.js";

const fs = require('fs');
const timeStamp = require('../lib/timeStamp.ts');
const permissions = require('../lib/permissions.ts');

module.exports = {
    name: 'permissions',
	data: new SlashCommandBuilder()
		.setName('permissions')
		.setDescription('Shows you a list of all the Bot Commands you have permissions for.')
        .addUserOption((option: SlashCommandUserOption) =>
            option.setName("member")
            .setDescription("The member whose permission you want to check.")
            .setRequired(true))
        .setDMPermission(false),
    user_command: {
        "name": "Permissions",
        "type": 2
    },
	async execute(interaction: UserContextMenuCommandInteraction | ChatInputCommandInteraction, user_command = false) {
        
        // interaction is either a UserContextMenuCommandInteraction or a ChatInputCommandInteraction depending on user_command
        interaction = user_command ? interaction as UserContextMenuCommandInteraction : interaction as ChatInputCommandInteraction;

        //Parse config.json
        var data = fs.readFileSync('./config.json');
        var config = JSON.parse(data);

        var member = user_command ? (interaction as UserContextMenuCommandInteraction).targetMember : interaction.options.get("member")?.member;
        member = member as GuildMember;

        if(!member) {
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to view permissions but no target member was found. user_command = ${user_command}`);
            return await interaction.reply({content : "No member was found.", flags: MessageFlags.Ephemeral});
        }

        const command_permissions = Object.keys(config.commandPermissions);

        let response = `Command Permissions for **${member.displayName}:** \n\n`;
        response += `haltStop_clear: **${member.permissions.has('ADMINISTRATOR' as PermissionResolvable)}**\n`;
        response += `clear: **${member.permissions.has('MANAGE_MESSAGES' as PermissionResolvable)}**\n`;

        // Construct response
        command_permissions.forEach(p => {
            response += `${p}: **${permissions.check_permissions(p, member)}**\n`;
        })

        await interaction.reply({content: response, flags: MessageFlags.Ephemeral});
        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} viewed the permissions of ${member.displayName}.`);
	}
};