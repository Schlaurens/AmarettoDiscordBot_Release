import { 
    ChatInputCommandInteraction, 
    SlashCommandUserOption, 
    UserContextMenuCommandInteraction, 
    GuildMember, 
    SlashCommandBuilder, 
    GuildVoiceChannelResolvable,
    ChannelType 
} from 'discord.js';

const timeStamp = require('../lib/timeStamp.ts');

module.exports = {
    name: 'hushhush',
    description: 'Moves a member through multiple channels in order to wake them up.',
    data: new SlashCommandBuilder()
        .setName('hushhush')
        .setDescription("Moves a member through multiple channels in order to wake him/her up.")
        .addUserOption((option: SlashCommandUserOption) => 
            option.setName("member")
            .setDescription("The member who is about to be moved around.")
            .setRequired(true))
        .setDMPermission(false),
    user_command: {
        "name": "HushHush",
        "type": 2
    },
    async execute(interaction: UserContextMenuCommandInteraction | ChatInputCommandInteraction, user_command = false){

        // interaction is either a UserContextMenuCommandInteraction or a ChatInputCommandInteraction depending on user_command
        interaction = user_command ? interaction as UserContextMenuCommandInteraction : interaction as ChatInputCommandInteraction;

        //Used to check permissions of a given member
        const permissions = require('../lib/permissions');
        const numOfMoves = 10

        //Check Permissions
        if (!permissions.check_permissions("hushhush", interaction.member)) {
            await interaction.reply({content : '**Insufficient permissions.**', ephemeral : true});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to hushhush a member but has insufficient permissions. user_command = ${user_command}`);
        }

        //========= Moving =============
        var member = user_command ? (interaction as UserContextMenuCommandInteraction).targetMember : interaction.options.get("member")?.member;

        if(!member) {
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} hushhush'd a member but no member was found. user_command = ${user_command}`);
            return await interaction.reply({content : "No member was found.", ephemeral : true});
        }
        member = member as GuildMember;
        
        var currentChannel = member.voice.channelId as string;

        if(!member.voice.channelId) {
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} hushhush'd ${member.displayName} but was not online. user_command = ${user_command}`);
            return await interaction.reply({content : "Member is not online.", ephemeral : true});
        }

        //get all the voice channels and exclude the currentChannel
        var channels = interaction.guild?.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice);
        if(!channels) {
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} hushhush'd ${member.displayName} but no voice channels were found. user_command = ${user_command}`);
            return await interaction.reply({content : "No voice channels were found.", ephemeral : true});
        }
        channels.delete(currentChannel);

        //reduces the amount of channels where to the user is moved to, to numOfMoves
        while(channels.size > numOfMoves -1) {
            channels.delete(channels.firstKey() as string);
        }

        //moving
        channels.each(channel => {
            try {
                (member as GuildMember)?.voice.setChannel(channel as GuildVoiceChannelResolvable);
            }
            catch (e) {
                console.log(e);
            }
        })
        member.voice.setChannel(currentChannel);

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} hushhush'd ${member.displayName}. user_command = ${user_command}`);
        return await interaction.reply({content: `${member.displayName} got hushhush'd ${numOfMoves} times.`, ephemeral: true});
    }
}