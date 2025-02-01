import { 
    ChatInputCommandInteraction, 
    MessageFlags
} from 'discord.js';
import type { Model } from 'mongoose';
import { Roast_Interface } from '../../models/roastSchema';

module.exports = {
    name: 'roast_remove',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, permissions: any, roast_model: Model<Roast_Interface>) {

        //Check permissions
        if (!permissions.check_permissions("roast_remove", interaction.member)) {
            await interaction.reply({content : '**Insufficient permissions.**', flags: MessageFlags.Ephemeral});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to remove a roast but has insufficient permissions`);
        }
        
        const roast_id = interaction.options.getString("id");

        let exists;
        try{
            exists = await roast_model.exists({_id : roast_id});
        }
        catch(err) {
            return await interaction.reply({content : "Invalid ID.", flags: MessageFlags.Ephemeral});
        }

        try{
            if(exists) {
                await roast_model.deleteOne({_id : roast_id});
                await interaction.reply("Roast has been removed.");
                return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} removed a roast.`);
            }
            else {
                return await interaction.reply({content : "Invalid ID.", flags: MessageFlags.Ephemeral});
            }
        }
        catch (err) {
            console.log(err);
        }

        return;
    }
}