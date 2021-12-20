const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'avatar',
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Show the avatar of the mentioned person.')
        .addMentionableOption(option =>
            option.setName("member")
            .setDescription('User whose avatar you want to see.')
            .setRequired(true)),
    user_command: {
        "name": "Avatar",
        "type": 2
    },
	async execute(interaction, timeStamp, Discord, colors, user_command) {

        // "user" is the name of the CommandInteractionOption which is given with the ContextMenuInteraction
        const member = user_command ? interaction.options.getMember("user") : interaction.options.get("member").member;

        const avatarEmbed = new Discord.MessageEmbed()
            .setColor(colors.blue_dark)
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setTitle("Avatar")
            .setImage(member.displayAvatarURL() + '?size=4096'); //Upscale image to size 4096
        
        await interaction.reply({embeds : [avatarEmbed], ephemeral: false});

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} viewed ${member.user.username}'s avatar. user_command = ${user_command}`);
	},
};