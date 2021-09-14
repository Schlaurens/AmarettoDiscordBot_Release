module.exports = {
    name: 'userinfo',
    description: 'displays the info a certain user (richEmbed)',
    execute(message, Discord, colors, client, timeStamp){
        
        var user;
        var member;
        var nickname;
        var status;

        if (message.mentions.users.first()) { //user is in a mention
            user = message.mentions.users.first();
            member = message.mentions.members.first();
        } 
        else { //else: author is used
            user = message.author;
            member = message.member;
        } 

        //See whether user has a nickname
        if(member.nickname == null) nickname = "---";
        else nickname = member.nickname;

        //See whether user is online
        if(!member.voice.channelID) status = "Offline";
        else status = "Online";

        //Reduce the number of displayed roles to 20. If the amount is lesser than 20 nothing is done.
        var roleCollection = member.roles.cache;
        if (roleCollection.array().length > 20) {
            
            while(roleCollection.size > 20) {
                //Remove the first roles in the collection
                roleCollection.delete(roleCollection.firstKey());
            }
        }

        var dateJoinedServer = member.joinedAt;
        var dateCreatedUser = member.user.createdAt;
        
        var premiumSince = member.premiumSince;
        if (!member.premiumSince) premiumSince = "Not Boosting"
        
        const sEmbed = new Discord.MessageEmbed()
        .setColor(colors.blue_dark)
        .setTitle("Userinfo: **" + user.username + "**")
        .setThumbnail(user.avatarURL())
        .addField("Nickname", nickname, true)
        .addField("Serverstatus", status, true)
        .addField("DiscordTag", user.tag, true)
        .addField("Joined Server", `${dateJoinedServer.getDate()}.${dateJoinedServer.getMonth() + 1}.${dateJoinedServer.getFullYear()}`, true)
        .addField("Joined Discord", `${dateCreatedUser.getDate()}.${dateCreatedUser.getMonth() + 1}.${dateCreatedUser.getFullYear()}`, true)
        .addField("Highest Role", member.roles.highest, true)
        .addField("Boosting Since", premiumSince, true)
        .addField("Roles", roleCollection.array().length, true)
        .setFooter(`${user.tag} | UserID: ${user.id}`);
        
        message.channel.send({embed: sEmbed});

        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} reviewed Userinfo of ${user.username}`);
        
    }
}