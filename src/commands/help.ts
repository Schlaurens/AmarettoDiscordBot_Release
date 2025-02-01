import { 
    ChatInputCommandInteraction, 
    Client,
    SlashCommandBuilder,
    EmbedBuilder,
    Colors,
    MessageFlags
} from 'discord.js';

const timeStamp = require('../lib/timeStamp.ts');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("Contains a list of all commands."),
    name: 'help',
    description: 'list of all the commands (richEmbed)',
    async execute(interaction: ChatInputCommandInteraction, client: Client, commands: any){

        var name;
        var description;
        var limit_reached = false;

        var sEmbed = new EmbedBuilder()
        .setTitle("Commands: ")
        .setColor(Colors.DarkBlue)

        for (var i = 0; i < commands.length; i++) {

            // If command is a User Command do not include it in /help
            if(commands[i]?.type == 2) continue;

            name = commands[i]?.name ?? "---";

            // If description is undefined put --- as a placeholder
            description = commands[i]?.description ?? "---";

            // i > 0 because fields is undefined in the beginning
            if(i > 0 && sEmbed.data.fields?.length == 25) {
                if(limit_reached){
                    await interaction.followUp({embeds : [sEmbed], flags: MessageFlags.Ephemeral});
                }
                else {
                    limit_reached = true;
                    await interaction.reply({embeds : [sEmbed], flags: MessageFlags.Ephemeral})
                }
                sEmbed = new EmbedBuilder();
            }
            sEmbed.addFields({name: `/${name}`, value: description});
        }

        sEmbed.setFooter({text: `Amaretto | Seine Majestät und Anführer dieses Servers.`, iconURL: client.user?.displayAvatarURL() ?? "Unknown"});

        if(limit_reached) await interaction.followUp({embeds : [sEmbed], flags: MessageFlags.Ephemeral});
        else await interaction.reply({embeds : [sEmbed], flags: MessageFlags.Ephemeral});

        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} requested help.`);
    }
}