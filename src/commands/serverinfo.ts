import { 
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    ChannelType,
    Guild,
    Colors
} from "discord.js";

const timeStamp = require('../lib/timeStamp.ts');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription("Returns information about the server.")
    .setDMPermission(false),
    name: 'serverinfo',
    description: 'Returns information about the server.',
    async execute(interaction: ChatInputCommandInteraction){
        
        var guild = interaction.guild;
        var date = guild?.createdAt;
        const owner = await guild?.fetchOwner();
        
        const sEmbed = new EmbedBuilder()
        .setColor(Colors.DarkBlue)
        .setTitle('Serverinfo')
        .setThumbnail((guild as Guild)?.iconURL())
        .addFields(
            {name: "Owner", value: owner?.user.tag ?? "Unknown", inline: true},
            {name: "Created", value: `${date?.getDate() ?? ""}.${date?.getMonth() ? date.getMonth() + 1 : ""}.${date?.getFullYear() ?? "Unknown"}`, inline: true},
            {name: "Members", value: guild?.memberCount.toString() ?? "Unknown", inline: true},
            {name: "Channel Categories", value: guild?.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size.toString() ?? "Unknown", inline: true},
            {name: "Voice Channels", value: guild?.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size.toString() ?? "Unknown", inline: true},
            {name: "Text Channels", value: guild?.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size.toString() ?? "Unknown", inline: true},
            {name: "Roles", value: guild?.roles.cache.size.toString() ?? "Unknown", inline: true},
            {name: "Serverboosts", value: guild?.premiumSubscriptionCount?.toString() ?? "Unknown", inline: true})
        .setFooter({text: `${guild?.name ?? "Unknown"} | ServerID: ${guild?.id ?? "Unknown"}`});
        
        await interaction.reply({embeds: [sEmbed]});

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} viewed server info`);
    }
}