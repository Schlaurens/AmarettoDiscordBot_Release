import { 
    ChatInputCommandInteraction 
} from 'discord.js';

module.exports = {
    name:'picture_size',
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any, pictures_model: any) {

        let picture_count = await pictures_model.count();

        await interaction.reply(`Wir haben **${picture_count} Bilder**.`);
        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} printed out the number of pictures. Count: ${picture_count}`);
    }
}