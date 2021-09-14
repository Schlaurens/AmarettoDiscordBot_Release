const picture = require('../picture');

module.exports = {
    name:'picture_file',

    async execute(message, timeStamp) {

        const pictures_model = require('../../models/picturesSchema');

        pictures = await pictures_model.find().lean();
        
        for (var i = 0; i < pictures.length; i++) {
            delete pictures[i]["_id"]
            delete pictures[i]["__v"]
        }
        pictures = JSON.stringify(pictures, null, 2);

        message.channel.send('```json\n' + pictures + '\n```');
        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} printed out a list of all pictures`);

        return;
    }
}