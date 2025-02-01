import { 
    Client, 
    ChatInputCommandInteraction,
    Colors,
    EmbedBuilder, 
    MessageFlags
} from 'discord.js';
import type { Model } from 'mongoose';
import { Roast_Interface } from '../../models/roastSchema';

module.exports = {
    name: 'roast_list',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, client: Client, roast_model: Model<Roast_Interface>) {
        
        let lean_roasts = await roast_model.find().lean();

        var roast;
        var roast_id;
        var limit_reached = false;
        
        // Embed limitation: 25 fields
        var sEmbed = new EmbedBuilder()
        .setTitle("List of all roasts.")
        .setColor(Colors.DarkBlue);

        for (var i = 0; i < lean_roasts.length; i++) {
            
            roast = lean_roasts[i]?.roast;
            roast_id = lean_roasts[i]?._id?.toString();
            
            // If the embed would be too long (> 25 fields)
            if(i > 1 && sEmbed.data.fields?.length == 25) {

                if(limit_reached) {
                    await interaction.reply({embeds : [sEmbed], flags: MessageFlags.Ephemeral});
                }
                else {
                    limit_reached = true;
                    await interaction.reply({embeds : [sEmbed], flags: MessageFlags.Ephemeral});
                }
                sEmbed = new EmbedBuilder();
            }
            sEmbed.addFields({name: `ID: ${roast_id}`, value: roast??"Unknown"});
        }
        sEmbed.setFooter({text: `Amaretto | Seine Majestät und Anführer dieses Servers.`, iconURL: client.user?.displayAvatarURL() ?? "Unknown"});

        if (limit_reached) await interaction.followUp({embeds : [sEmbed], flags: MessageFlags.Ephemeral});
        else await interaction.reply({embeds : [sEmbed], flags: MessageFlags.Ephemeral});
        
        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} printed out a list of all roasts.`);
    }
}