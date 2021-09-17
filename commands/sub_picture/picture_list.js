module.exports = {
    name: 'picture_list',
    async execute(interaction, timeStamp, Discord, client, pictures_model) {
        
        const colors = require('../../colors.json');
        let lean_pictures = await pictures_model.find().lean();

        var picture;
        var limit_reached = false;

        // Embed limitation: 25 fields
        var sEmbed = new Discord.MessageEmbed()
        .setTitle("List of all Pictures.")
        .setColor(colors.blue_dark);
        
        for (var i = 0; i < lean_pictures.length; i++) {
            
            picture = lean_pictures[i].name;
            
            // If the embed would be too long (> 25 fields)
            if(sEmbed.fields.length == 25) {
                
                if(limit_reached){
                    await interaction.followUp({embeds : [sEmbed], ephemeral: true});
                } 
                else {
                    limit_reached = true;
                    await interaction.reply({embeds : [sEmbed], ephemeral: true});
                }

                sEmbed = new Discord.MessageEmbed();
            }

            sEmbed.addField(i.toString(), picture)
        }
        sEmbed.setFooter(`Amaretto | Seine Majestät und Anführer dieses Servers.`, client.user.displayAvatarURL());

        if (limit_reached) await interaction.followUp({embeds : [sEmbed], ephemeral: true});
        else await interaction.reply({embeds : [sEmbed], ephemeral: true});
        
        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} printed out a list of all pictures.`);
    }
}