import { 
    ChatInputCommandInteraction, 
    Client,
    Colors,
    EmbedBuilder, 
    MessageFlags
} from 'discord.js';
import type { Model } from 'mongoose';
import { Picture_Interface } from '../../models/picturesSchema';

module.exports = {
    name: 'picture_list',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, client: Client, pictures_model: Model<Picture_Interface>) {

        let lean_pictures = await pictures_model.find().lean();

        var picture;
        var limit_reached = false;

        // Embed limitation: 25 fields
        var sEmbed = new EmbedBuilder()
        .setTitle("List of all Pictures.")
        .setColor(Colors.DarkBlue);

        for (var i = 0; i < lean_pictures.length; i++) {

            picture = lean_pictures[i]?.name;

            // If the embed would be too long (> 25 fields)
            if(i > 0 && sEmbed.data.fields?.length == 25) {

                if(limit_reached){
                    await interaction.followUp({embeds : [sEmbed], flags: MessageFlags.Ephemeral});
                } 
                else {
                    limit_reached = true;
                    await interaction.reply({embeds : [sEmbed], flags: MessageFlags.Ephemeral});
                }

                sEmbed = new EmbedBuilder();
            }

            sEmbed.addFields({name: i.toString(), value: picture ?? "Unknown Picture"});
        }
        sEmbed.setFooter({text: `Amaretto | Seine Majestät und Anführer dieses Servers.`, iconURL: client.user?.displayAvatarURL() ?? ""});

        if (limit_reached) await interaction.followUp({embeds : [sEmbed], flags: MessageFlags.Ephemeral});
        else await interaction.reply({embeds : [sEmbed], flags: MessageFlags.Ephemeral});

        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} printed out a list of all pictures.`);
    }
}