module.exports = {
    name: 'serverinfo',
    description: 'returns information about the server',
    execute(message, Discord, colors, client, timeStamp){
        
        var guild = message.guild;
        var date = guild.createdAt;

        const sEmbed = new Discord.MessageEmbed()
        .setColor(colors.blue_dark)
        .setTitle('Serverinfo')
        .setThumbnail(guild.iconURL())
        .addField("Owner", guild.owner.user.tag, true)
        .addField("Created", `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`, true)
        .addField("Members", guild.memberCount, true)
        .addField("Category Channels", guild.channels.cache.array().filter(c => c.type === 'category').length, true)
        .addField("Voice Channels", guild.channels.cache.array().filter(c => c.type === 'voice').length, true)
        .addField("Text Channels", guild.channels.cache.array().filter(c => c.type === 'text').length, true)
        .addField("Roles", guild.roles.cache.array().length, true)
        .addField("Serverboosts", guild.premiumSubscriptionCount, true)
        .setFooter(`${guild.name} | ServerID: ${guild.id}`);
        
        message.channel.send({embed: sEmbed});

        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} opened server info`);
    }
}