const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'hushhush',
    description: 'Moves a member through multiple channels in order to wake them up.',
    data: new SlashCommandBuilder()
        .setName('hushhush')
        .setDescription("Moves a member through multiple channels in order to wake him/her up.")
        .addUserOption(option => 
            option.setName("member")
            .setDescription("The member who is about to be moved around.")
            .setRequired(true))
        .addNumberOption(option => 
            option.setName("moves")
            .setDescription("The amount of channels the member will be moved through.")
            .setRequired(false)
            .addChoice("5", 5)
            .addChoice("10", 10)),
    user_command: {
        "name": "HushHush",
        "type": 2
    },
    async execute(interaction, timeStamp, user_command){
        
        //Used to check permissions of a given member
        const permissions = require('../lib/permissions');

        const moves = interaction.options.get("moves");

        // Default value for numOfMoves is 10
        const numOfMoves = moves ? moves.value : 10

        //Check Permissions
        if (!permissions.check_permissions("hushhush", interaction.member)) {
            await interaction.reply({content : '**Insufficient permissions.**', ephemeral : true});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} tried to hushhush a member but has insufficient permissions. user_command = ${user_command}`);
        }
        
        //========= Moving =============
        const member = user_command ? interaction.options.getMember("user") : interaction.options.get("member").member;

        var currentChannel = member.voice.channelId;

        if(!member.voice.channelId) {
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} hushhush'd ${member.user.username} but was not online. user_command = ${user_command}`);
            return await interaction.reply({content : "Member is not online.", ephemeral : true});
            
        }

        //get all the voice channels and exclude the currentChannel
        var channels = interaction.guild.channels.cache.filter(channel => channel.type === "GUILD_VOICE");
        channels.delete(currentChannel);
        
        //reduces the amount of channels where to the user is moved to, to numOfMoves
        while(channels.size > numOfMoves -1) {
            channels.delete(channels.firstKey());
        }

        //moving
        channels.each(channel => {
            try {
                member.voice.setChannel(channel);
            }
            catch (e) {
            }
        })
        member.voice.setChannel(currentChannel);
    
        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} hushhush'd ${member.user.username}. user_command = ${user_command}`);
        return await interaction.reply({content: `${member.user.username} got hushhush'd ${numOfMoves} times.`, ephemeral: true});
    }
}