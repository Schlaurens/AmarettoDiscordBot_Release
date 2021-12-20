const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'permissions',
	data: new SlashCommandBuilder()
		.setName('permissions')
		.setDescription('Shows you a list of all the Bot Commands you have permissions for.')
        .addMentionableOption(option =>
            option.setName("member")
            .setDescription("The member whose permission you want to check.")
            .setRequired(false)),
	async execute(interaction, timeStamp, fs) {
        
        //Parse config.json
        var data = fs.readFileSync('./config.json');
        var config = JSON.parse(data);
        
        const permissions = require('../lib/permissions');

        const option = interaction.options.get("member")
        const user = option ? option.user : interaction.user; //if no mention, take author
        const member = option ? option.member : interaction.member; 

        const command_permissions = Object.keys(config.commandPermissions);

        let response = `Command Permissions for **${user.tag}:** \n\n`;
        response += `haltStop_clear: **${member.permissions.has('ADMINISTRATOR')}**\n`;
        response += `clear: **${member.permissions.has('MANAGE_MESSAGES')}**\n`;

        // Construct response
        command_permissions.forEach(p => {
            response += `${p}: **${permissions.check_permissions(p, member)}**\n`;
        })

        await interaction.reply({content: response, ephemeral: true});

        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} viewed the permissions of ${user.username}.`);
	}
};