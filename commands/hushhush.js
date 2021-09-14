module.exports = {
    name: 'hushhush',
    description: 'moved a member through multiple channels',
    execute(message, args, timeStamp, fs){
        
        //Used to check permissions of a given member
        const permissions = require('../lib/permissions');

        //Parse config.json
        var data = fs.readFileSync('./config.json');
        var config = JSON.parse(data);

        if(config["hushhush_numOfMoves"]) numOfMoves = config["hushhush_numOfMoves"];
        else numOfMoves = 10;
        
        
        //Check Permissions
        if (!permissions.check_permissions("hushhush", message.member)) {
            message.channel.send('Insufficient permissions.');
                    console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to hushhush a member but has insufficient permissions`);
                    return;
        }
        
        //========= Moving =============
        if (args[1] && message.mentions.users.first()) { //Check mention
            var personCust = message.guild.member(message.mentions.users.first().id);

            var currentChannel = personCust.voice.channelID;

            if(!personCust.voice.channelID) {
                console.log(`${timeStamp.getTimeStamp()} ${message.author.username} hushhush'd ${message.mentions.users.first()} but was not online`);
                return message.channel.send('user is not online');
                
            }

            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} hushhush'd ${message.mentions.users.first().username}`);

            //get all the voice channels and exclude the currentChannel
            var channels = message.guild.channels.cache.filter(channel => channel.type === "voice");
            channels.delete(currentChannel);
            
            //reduces the amount of channels where to the user is moved to, to numOfMoves
            while(channels.size > numOfMoves -1) {
                channels.delete(channels.firstKey());
            }

            //moving
            channels.each(channel => {
                try {
                    personCust.voice.setChannel(channel);
                }
                catch (e) {
                }
            })
            personCust.voice.setChannel(currentChannel);
        }
        else if (!args[1]) message.channel.send("Brauche 'nen Benutzernamen.")
        return;
    }
}