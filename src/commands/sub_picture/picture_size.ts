import { 
    ChatInputCommandInteraction 
} from 'discord.js';
import type {Model} from 'mongoose';
import { Picture_Interface } from '../../models/picturesSchema';

module.exports = {
    name:'picture_size',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, pictures_model: Model<Picture_Interface>) {

        let picture_count = await pictures_model.countDocuments();

        await interaction.reply(`Wir haben **${picture_count} Bilder**.`);
        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} printed out the number of pictures. Count: ${picture_count}`);
    }
}