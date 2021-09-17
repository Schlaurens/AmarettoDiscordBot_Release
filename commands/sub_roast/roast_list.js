module.exports = {
    name: 'roast_list',
    async execute(interaction, timeStamp, Discord, client, roast_model) {
        
        const colors = require('../../colors.json');
        let lean_roasts = await roast_model.find().lean();

        var roast;
        var roast_id;
        var limit_reached = false;
        
        // Embed limitation: 25 fields
        var sEmbed = new Discord.MessageEmbed()
        .setTitle("List of all roasts.")
        .setColor(colors.blue_dark);

        for (var i = 0; i < lean_roasts.length; i++) {
            
            roast = lean_roasts[i].roast;
            roast_id = lean_roasts[i]._id.toString();
            
            // If the embed would be too long (> 25 fields)
            if(sEmbed.fields.length == 25) {

                if(limit_reached) {
                    await interaction.reply({embeds : [sEmbed], ephemeral: true});
                }
                else {
                    limit_reached = true;
                    await interaction.reply({embeds : [sEmbed], ephemeral: true});
                }
                
                sEmbed = new Discord.MessageEmbed();
            }

            sEmbed.addField(`ID: ${roast_id}`, roast)
        }
        sEmbed.setFooter(`Amaretto | Seine Majestät und Anführer dieses Servers.`, client.user.displayAvatarURL());

        if (limit_reached) await interaction.followUp({embeds : [sEmbed], ephemeral: true});
        else await interaction.reply({embeds : [sEmbed], ephemeral: true});
        
        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} printed out a list of all roasts.`);
    }
}