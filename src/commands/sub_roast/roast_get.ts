import { 
    ChatInputCommandInteraction,
    GuildMember,
    User 
} from 'discord.js';
import type { Model } from 'mongoose';
import { Roast_Interface } from '../../models/roastSchema';

module.exports = {
    name: 'roast_get',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, roast_model: Model<Roast_Interface>, get_roast: any) {
        
        const roast_size = await roast_model.countDocuments();
        const options = interaction.options;

        // Roast the mentioned person
        if (options.getMember("member")) {

            let mention_name = undefined;

            mention_name = options.getMember("member") ? (options.getMember("member") as GuildMember)?.displayName : (options.getUser("member") as User).displayName;
            

            const mentionNameUpperCase = mention_name?.replace(mention_name.substring(0, 1), mention_name.substring(0, 1).toUpperCase() ?? "Unknown");

            const random = Math.floor(Math.random() * roast_size);
            const roast_sentence = await get_roast(random);

            interaction.reply(roast_sentence["roast"].replace('$name$', mentionNameUpperCase));
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} roasted ${mentionNameUpperCase} (Mention). Index: ${random}.`);
        }
        //Roast the specified person (by name)
        else if (options.getString("name")) {

            const name = interaction.options.getString("name");

            const personUp = name?.replace(name.substring(0, 1), name.substring(0, 1).toUpperCase()); //Make first letter of name uppercase
            const random = Math.floor(Math.random() * roast_size);

            const roast_sentence = await get_roast(random);
            interaction.reply(roast_sentence["roast"].replace('$name$', personUp));

            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} roasted ${personUp} (no Mention). Index: ${random}`);
        } 
        // Roast the author of message
        else {

            const author_name = (interaction.member as GuildMember)?.displayName ? (interaction.member as GuildMember).displayName : interaction.user.displayName;
            const random = Math.floor(Math.random() * roast_size);
            const roast_sentence = await get_roast(random);

            interaction.reply(roast_sentence["roast"].replace('$name$', author_name));
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} roasted himself/herself. Index: ${random}`);
        }
    }
}