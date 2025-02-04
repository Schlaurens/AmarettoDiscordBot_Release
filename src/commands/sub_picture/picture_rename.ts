import { 
    ChatInputCommandInteraction, 
    MessageFlags
} from 'discord.js';
import type { Model } from 'mongoose';
import { Picture_Interface } from '../../models/picturesSchema';

module.exports = {
    name:'picture_rename',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, permissions: any, pictures_model: Model<Picture_Interface>) {

        // Permission check
        if (!permissions.check_permissions("picture_rename", interaction.member)) {
            await interaction.reply({content: '**Insufficient permissions.**', flags: MessageFlags.Ephemeral});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried rename a picture but has insufficient permissions`);
        }

        const current_title = interaction.options.getString("current_title");
        const new_title = interaction.options.getString("new_title");

        // RegEx: Case insensitive
        const count_picture = await pictures_model.countDocuments({name : { $regex: new RegExp('^'+ new_title + '$', "i")}})
        var picture = await pictures_model.findOne({name : { $regex: new RegExp('^'+ current_title + '$', "i")}}); 
        
        if(!picture) {
            return await interaction.reply({content: `The picture **${current_title}** was not found.`, flags: MessageFlags.Ephemeral});
        }

        // If a picture with the new_title already exists. The picture to be changed is excluded from this.
        if(count_picture > 1 || (count_picture == 1 && picture["name"].toLowerCase() !== new_title?.toLowerCase())) {
            return await interaction.reply({content: `**${new_title}** is already taken.`, flags: MessageFlags.Ephemeral});
        }

        await pictures_model.updateOne({_id: picture._id}, {$set: {name : new_title}});
        await interaction.reply({content: `**${picture["name"]}** was renamed to **${new_title}**.`});

        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} renamed a picture. old_title: ${picture["name"]}, new_title: ${new_title}`);
    }
}