import { 
    ChatInputCommandInteraction, 
    MessageFlags
} from 'discord.js';
import type { Model } from 'mongoose';
import { Roast_Interface } from '../../models/roastSchema';

module.exports = {
    name: 'roast_add',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, permissions: any, roast_model: Model<Roast_Interface>) {

        //Check permissions
        if(!permissions.check_permissions("roast_add", interaction.member)) {
            await interaction.reply({content : '**Insufficient permissions.**', flags: MessageFlags.Ephemeral});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to add a roast but has insufficient permissions`);
        }

        const roastSentence = interaction.options.getString("sentence");

        if (!roastSentence) {
            return await interaction.reply({content : "Please enter a roast.", flags: MessageFlags.Ephemeral});
        }

        // Check whether roast is too long (> 1024 characters)
        if (roastSentence.length > 1024) {
            return await interaction.reply({content : "Roast cannot be longer than 1024 characters.", flags: MessageFlags.Ephemeral});
        }
        
        //Check whether roast already exists
        try{
            if(await roast_model.exists({roast : roastSentence})) {
                return await interaction.reply({content : "Roast already exists.", flags: MessageFlags.Ephemeral});
            }
        }
        catch (err){
            console.log(err);
        }

        // get size of roast database
        const index = await roast_model.countDocuments();

        let roast = await roast_model.create({
            roast: roastSentence
        });
        roast.save();

        await interaction.reply("Roast added.");

        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} added a new roast. Index: ${index}`);
    }
}