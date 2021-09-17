const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("Contains a list of all commands."),
    name: 'help',
    description: 'list of all the commands (richEmbed)',
    async execute(interaction, Discord, colors, client, timeStamp, commands){

        var name;
        var description;
        var limit_reached = false;
        
        const sEmbed = new Discord.MessageEmbed()
        .setTitle("Commands: ")
        .setColor(colors.blue_dark)
        
        for (var i = 0; i < commands.length; i++) {
            name = commands[i].name;
            description = commands[i].description;
            
            if(sEmbed.fields.length == 25) {

                if(limit_reached){
                    await interaction.followUp({embeds : [sEmbed], ephemeral: true});
                }
                else {
                    limit_reached = true;
                    await interaction.reply({embeds : [sEmbed], ephemeral: true})
                }

                sEmbed = new Discord.MessageEmbed();
            }

            sEmbed.addField(`/${name}`, description);
        }
        
        sEmbed.setFooter(`Amaretto | Seine Majestät und Anführer dieses Servers.`, client.user.displayAvatarURL());
        
        if(limit_reached) await interaction.followUp({embeds : [sEmbed], ephemeral: true});
        else await interaction.reply({embeds : [sEmbed], ephemeral: true});

        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} requested help.`);
    }
}