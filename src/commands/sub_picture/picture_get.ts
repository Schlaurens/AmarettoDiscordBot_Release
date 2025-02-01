import { 
    ChatInputCommandInteraction, 
    MessageFlags
} from 'discord.js';
import type { Model } from 'mongoose';
import { Picture_Interface } from '../../models/picturesSchema';

module.exports = {
    name:'picture_get',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, pictures_model: Model<Picture_Interface>, search_by_name: any) {

        let pictures_count = await pictures_model.countDocuments();
        const index_option = interaction.options.getNumber("index");

        if (index_option && index_option <= pictures_count) {

            let picture = await pictures_model.findOne().skip(index_option) ?? {name: "Unknown", url: "Unknown"};

            await interaction.reply(`Title: **${picture["name"]}**   ${picture["url"]}`);
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} requested a picture and got: ${picture["name"]}`);
        }

        //Send a specified picture (search by name)
        else if (interaction.options.getString('title')) {

            const title = interaction.options.getString("title");

            var re = new RegExp(title?.toLowerCase() ?? "");

            search_by_name(re, title, async (picture: {name: string, url: string}) => {
                if (picture !== undefined) {
                    await interaction.reply(`Title: **${picture["name"]}**   ${picture["url"]}`);
                    console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} requested a picture and got: ${picture["name"]}`);
                    return;
                }
                return await interaction.reply({content : 'Picture not found.', flags: MessageFlags.Ephemeral});
            });
        }

        //Send a random picture
        else {

            var random = Math.floor(Math.random() * pictures_count);

            // Get picture from database
            let picture = await pictures_model.findOne().skip(random) ?? {name: "Unknown", url: "Unknown"};

            // Send picture
            await interaction.reply(`Title: **${picture["name"]}**   ${picture["url"]}`);
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} requested a picture and got: ${picture["name"]}`);
        }
    }
}