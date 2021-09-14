module.exports = {
    name: 'roll',
    description: 'Tosses a coin (Heads or tails)',
    execute(message, timeStamp, args){

        var max;
        
        if(!isNaN(args[1])) max = args[1];
        else if (!args[1]) max = 6;
        else {
            message.channel.send("Gib als Argument eine Nummer an.");
            return;
        }
        
        var result = Math.floor(Math.random() * Math.floor(max)) + 1;

        message.channel.send(result);

        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} rolled a ${result} on a ${max} sided die`);
    }
}