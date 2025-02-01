import { 
    ChatInputCommandInteraction, 
    MessageFlags
} from 'discord.js';
import type { Model } from 'mongoose';
import { Picture_Interface } from '../../models/picturesSchema';

module.exports = {
    name:'picture_remove',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, permissions: any, pictures_model: Model<Picture_Interface>) {

        // Permission check
        if (!permissions.check_permissions("picture_remove", interaction.member)) {
            await interaction.reply({content: '**Insufficient permissions.**', flags: MessageFlags.Ephemeral});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to add a roast but has insufficient permissions`);
        }

        const title = interaction.options.getString("title");
        
        // RegEx case sensitive
        var picture = await pictures_model.findOne({name : { $regex: new RegExp('^'+ title + '$')}}); 
        
        if(picture) {
            let del_pic = await pictures_model.findOneAndDelete({name : picture["name"]}) ?? {name: "Unknown", url: "Unknown"};

            await interaction.reply(`**${picture["name"]}** has been removed.`);
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} removed a picture. Name: ${del_pic["name"]}.`);
        }
        else {
            return await interaction.reply({content: "Picture not found.", flags: MessageFlags.Ephemeral});
        }
    }
}