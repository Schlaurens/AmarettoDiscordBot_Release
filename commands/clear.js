module.exports = {
    name: 'clear',
    description: 'deletes a given number of messages',
    execute(message, args, timeStamp){

        var numOfMessages = args[1];


        //==== Permission Handler ====
        //Only members with 'MANAGE_MESSAGES' permissions in the channel can use /clear
        if(!message.member.hasPermission('MANAGE_MESSAGES')) {

            message.channel.send("Insufficient permissions.");
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to clear numOfMessages but has insufficient permissions.`);

            return;
        }

        //==== Condition checking ====
        if(!numOfMessages) return message.channel.send("Please specify the amount of messages you want deleted.");
        if (isNaN(numOfMessages)) return message.channel.send(`${numOfMessages} is not a number.`);
        if(numOfMessages >= 100) return message.channel.send("Cannot delete more than 99 messages at once.");
        if(numOfMessages < 1) return message.channel.send("You have to delete at least one message.");
        
        //Also delete the /clear command message.
        numOfMessages++;
        
        message.channel.bulkDelete(numOfMessages)
        .then(data => {
            numOfMessages--;
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} deleted ${numOfMessages} messages in the channel '${message.channel.name}'`);
        })
        .catch(err => {
            message.channel.send("Nachrichten, die älter als **14 Tage** sind können nicht gelöscht werden...")
            numOfMessages--;
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to delete ${numOfMessages} message in the channel '${message.channel.name}' but the message was older than 14 days`)
        });
    }
}