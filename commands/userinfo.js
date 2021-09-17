const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription("Displays the info a user.")
    .addUserOption(options =>
        options.setName('user')
        .setDescription('User to get information about.')
        .setRequired(true)),
    name: 'userinfo',
    description: 'Displays the info a user.',
    async execute(interaction, Discord, colors, timeStamp){
        
        const user = interaction.options.get("user").user;
        const member = interaction.options.get("user").member;
        const nickname = member.nickname ? member.nickname : '---';
        const status = member.voice.channelId ? 'In Channel' : 'Not in Channel';
        const dateJoinedServer = member.joinedAt;
        const dateCreatedUser = member.user.createdAt;
        const premiumSince = member.premiumSince ? member.premiumSince : 'Not Boosting';
        
        const sEmbed = new Discord.MessageEmbed()
        .setColor(colors.blue_dark)
        .setTitle("Userinfo: **" + user.username + "**")
        .setThumbnail(user.avatarURL())
        .addField("Nickname", nickname, true)
        .addField("Serverstatus", status, true)
        .addField("DiscordTag", user.tag, true)
        .addField("Joined Server", `${dateJoinedServer.getDate()}.${dateJoinedServer.getMonth() + 1}.${dateJoinedServer.getFullYear()}`, true)
        .addField("Joined Discord", `${dateCreatedUser.getDate()}.${dateCreatedUser.getMonth() + 1}.${dateCreatedUser.getFullYear()}`, true)
        .addField("Highest Role", member.roles.highest.toString(), true)
        .addField("Boosting Since", premiumSince, true)
        .addField("Roles", roleCollection.size.toString(), true)
        .setFooter(`${user.tag} | UserID: ${user.id}`);
        
        await interaction.reply({embeds: [sEmbed]});

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} viewed Userinfo of ${user.username}`);
        
    }
}