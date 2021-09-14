module.exports = {
    name: 'save',
    description: 'saves a given picture in the pictures directory',
    async execute(message, args, timeStamp, fs){

        const imgur = require('imgur');
        const picture_model = require('../models/picturesSchema');

        //Used to check permissions of a given member
        const permissions = require('../lib/permissions');

        //Check Permissions
        if (!permissions.check_permissions("save", message.member)) {
            message.channel.send('Insufficient permissions.');
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to backup roles but has insufficient permissions`);
            return;
        }
        
        if(!args[1]) return message.channel.send("Ich brauche 'ne URL.")

        var imgName = args[2];

        //Get the image name without .png and what not.
        if(!imgName) imgName = args[1].split('/').slice(-1).pop().split('.').shift(); 
        

        //Check whether the image name or link is already in the pictures JSON.
        if(await picture_model.exists({name : { $regex: new RegExp('^'+ imgName + '$', "i")}})) {
            return message.channel.send("Dieser Name ist bereits vergeben.")
        }
        else if (await picture_model.exists({url : args[1]})) {
            return message.channel.send("Dieses Bild existert bereits unter einem anderen Namen.")
        }

        //Upload URL to Imgur 
        uploadToImgur(args[1], async (imgLink) => {
            
            // Insert into database
            let picture = await picture_model.create({
                name: imgName,
                url: imgLink
            })
            await picture.save();

            message.channel.send("Das Bild wurde erfolgreich gespeichert.")
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} saved a picture. name: '${imgName}'.`);
        });

        
        //====== Functions ======
        /**
         * Uploads the given the picture from the link to Imgur and generates an Imgur-link
         * @param {*} link the original link of the picture
         * @param {*} callback callback function with Imgur-link 
         */
        function uploadToImgur (link, callback) {
            message.channel.send("Bild wird hochgeladen...");

            imgur.uploadUrl(link)
                .then((json) => {
                    callback(json.link);
                })
                .catch((err) => {
                    console.log(err.message);
                    message.channel.send(err.message);
                });
        }
    }
}