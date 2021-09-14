module.exports = {
    name: 'ping',
    description: 'replies to ping',
    execute(message, timeStamp, client){
        
        message.channel.send(`Ping : **${Date.now() - message.createdTimestamp}ms** \nAPI Latency: **${Math.round(client.ws.ping)}ms**`)

        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} pinged the bot`);
    }
}