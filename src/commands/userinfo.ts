import { 
    SlashCommandUserOption, 
    SlashCommandBuilder, 
    EmbedBuilder, 
    UserContextMenuCommandInteraction, 
    ChatInputCommandInteraction, 
    GuildMember,
    Colors 
} from "discord.js";

const timeStamp = require('../lib/timeStamp.ts');

module.exports = {
    name: 'userinfo',
    description: 'Displays the info a user.',
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription("Displays the info a user.")
        .addUserOption((options: SlashCommandUserOption) =>
            options.setName('user')
            .setDescription('User to get information about.')
            .setRequired(true))
        .setDMPermission(false),
    user_command: {
        "name": "Info",
        "type": 2
    },
    async execute(interaction: UserContextMenuCommandInteraction | ChatInputCommandInteraction, user_command = false){

        // interaction is either a UserContextMenuCommandInteraction or a ChatInputCommandInteraction depending on user_command
        interaction = user_command ? interaction as UserContextMenuCommandInteraction : interaction as ChatInputCommandInteraction;

        var member = user_command ? (interaction as UserContextMenuCommandInteraction).targetMember : interaction.options.get("user")?.member;
        if(!member) {
            const sEmbed = new EmbedBuilder()
            .setColor(Colors.DarkBlue)
            .setDescription(`Couldn't find user **${interaction.options.data[0]?.value ?? "Unknown"}**`)
            await interaction.reply({embeds: [sEmbed], ephemeral: true});

            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to view the userinfo of an unknown user ${interaction.options.data[0]?.value ?? "Unknown"}.`);
            return
        }
        
        member = member as GuildMember;
        const user = member.user;
        const displayName = member.displayName != user.username ? member.displayName : '---';
        const status = member.voice.channelId ? 'In Channel' : 'Not in Channel';
        const dateJoinedServer = member.joinedAt;
        const dateCreatedUser = member.user.createdAt;
        const premiumSince = member.premiumSince ? `${member.premiumSince.getDate()}.${member.premiumSince.getMonth() + 1}.${member.premiumSince.getFullYear()}` : 'Not Boosting';
        var roleCollection = member.roles.cache;
        
        //Reduce the number of displayed roles to 20. If the amount is lesser than 20 nothing is done.
        while(roleCollection.size > 20) {
            //Remove the first roles in the collection
            roleCollection.delete(roleCollection.firstKey() as string);
        }
        
        const sEmbed = new EmbedBuilder()
        .setColor(Colors.DarkBlue)
        .setTitle("Userinfo: **" + member.displayName + "**")
        .setThumbnail(user.displayAvatarURL())
        .addFields(
            {name: "DisplayName", value: displayName, inline: true}, 
            {name: "Serverstatus", value: status, inline: true},
            {name: "DiscordTag", value: user.tag, inline: true},
            {name: "Joined Server", value: `${dateJoinedServer?.getDate() ?? ""}.${dateJoinedServer?.getMonth() ? dateJoinedServer.getMonth() + 1: ""}.${dateJoinedServer?.getFullYear() ?? "Unknown"}`, inline: true},
            {name: "Joined Discord", value: `${dateCreatedUser.getDate()}.${dateCreatedUser.getMonth() + 1}.${dateCreatedUser.getFullYear()}`, inline: true},
            {name: "Highest Role", value: member.roles.highest.toString(), inline: true},
            {name: "Boosting Since", value: premiumSince, inline: true},
            {name: "Roles", value: (roleCollection.size - 1).toString(), inline: true})
        .setFooter({text: `${user.tag} | UserID: ${user.id}`});
        
        await interaction.reply({embeds: [sEmbed]});

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} viewed Userinfo of ${user.displayName}. user_command = ${user_command}`);
    }
}