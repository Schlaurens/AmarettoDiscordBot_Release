module.exports = {

    name:'picture_number',
    async execute(message, timeStamp) {

        const pictures_model = require('../../models/picturesSchema')

        let picture_count = await pictures_model.count();

        message.channel.send(`Wir haben **${picture_count} Bilder**.`);
        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} printed out the number of pictures. Count: ${picture_count}`);

        return;
    }
}