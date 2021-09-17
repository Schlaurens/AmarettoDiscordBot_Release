const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription("Returns information about the server."),
    name: 'serverinfo',
    description: 'Returns information about the server.',
    async execute(interaction, Discord, colors, timeStamp){
        
        var guild = interaction.guild;
        var date = guild.createdAt;
        const owner = await guild.fetchOwner();
        
        const sEmbed = new Discord.MessageEmbed()
        .setColor(colors.blue_dark)
        .setTitle('Serverinfo')
        .setThumbnail(guild.iconURL())
        .addField("Owner", `${owner.user.tag}`, true)
        .addField("Created", `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`, true)
        .addField("Members", guild.memberCount.toString(), true)
        .addField("Channel Categories", guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size.toString(), true)
        .addField("Voice Channels", guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size.toString(), true)
        .addField("Text Channels", guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size.toString(), true)
        .addField("Roles", guild.roles.cache.size.toString(), true)
        .addField("Serverboosts", guild.premiumSubscriptionCount.toString(), true)
        .setFooter(`${guild.name} | ServerID: ${guild.id}`);
        
        await interaction.reply({embeds: [sEmbed]});

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} viewed server info`);
    }
}