module.exports = {
    name:'picture_remove',
    async execute(message, args, timeStamp, permissions) {

        const pictures_model = require('../../models/picturesSchema');

        // Permission check
        if (!permissions.check_permissions("picture_remove", message.member)) {
            message.channel.send('Insufficient permissions.');
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to add a roast but has insufficient permissions`);
            return;
        }

        if (!args[2]) {
            message.channel.send("Bitte gib den Index von dem zu löschenden Bild an.");
            return;
        }

        let picture_count = await pictures_model.count();

        //Check whether the index is valid
        if (args[2] >= picture_count) {
            message.channel.send("Ungültiger Index.");
            return;
        }
        // Delete the picture
        let del_pic = await pictures_model.findOneAndDelete().skip(args[2])
       
        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} removed a picture. Name: ${del_pic["name"]} Index: ${args[2]}.`);

        return;
    }
}