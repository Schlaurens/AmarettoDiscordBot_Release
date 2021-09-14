module.exports = {
    name: 'roast_file',

    async execute(message, timeStamp, args, fs, roast_model) {
        
        let lean_roasts = await roast_model.find().lean();

        data = JSON.stringify(lean_roasts, null, 1)
        message.channel.send('```json\n' + data + '\n ```')
        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} printed out a list of all roasts.`);

        return;
    }
}