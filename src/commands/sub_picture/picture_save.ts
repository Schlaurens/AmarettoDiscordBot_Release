import { 
    ChatInputCommandInteraction 
} from 'discord.js';

module.exports = {
    name: 'picture_save',
    description: 'Saves a given picture in the pictures directory',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, permissions: any, picture_model: any){

        const imgur = require('imgur');

        //Check Permissions
        if (!permissions.check_permissions("picture_save", interaction.member)) {
            await interaction.reply({content : '**Insufficient permissions.**', ephemeral: true});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to save a picture but has insufficient permissions`);
        }

        const imgName = interaction.options.getString("title");
        const url = interaction.options.getString("url");
        
        //Check whether the image name or link is already in the pictures database.
        if(await picture_model.exists({name : { $regex: new RegExp('^'+ imgName + '$', "i")}})) {
            return await interaction.reply({content : `The title **\"${imgName}\"** is already taken.`, ephemeral: true})
        }
        else if (await picture_model.exists({url : url})) {
            return await interaction.reply({content : "This picture has already been saved under a different name.", ephemeral: true});
        }

        //Upload URL to Imgur 
        uploadToImgur(url as string, async (imgLink: string) => {
            const picture_count = await picture_model.count();
            
            // Insert into database
            let picture = await picture_model.create({
                name: imgName,
                url: imgLink
            })
            await picture.save();

            await interaction.editReply(`The picture **\"${imgName}\"** has been saved. **Index: ${picture_count}**`);
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} saved a picture. name: '${imgName}'.`);
        });

        
        //====== Functions ======
        /**
         * Uploads the given the picture from the link to Imgur and generates an Imgur-link
         * @param {*} link the original link of the picture
         * @param {*} callback callback function with Imgur-link 
         */
        async function uploadToImgur (link: string, callback: any) {
            await interaction.reply("Uploading...");

            imgur.uploadUrl(link)
                .then((json: any) => {
                    callback(json.link);
                })
                .catch(async (err: any) => {
                    console.log(err.message);
                    await interaction.editReply(err.message);
                });
        }
    }
}