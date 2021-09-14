module.exports = {
    name: 'smart',
    description: 'Posts a picture of the smartest man alive',
    execute(message, timeStamp, args){

        message.channel.send({files: ['./assets/smart/cursedheimer.png']});

        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} used /smart`);
    }
}