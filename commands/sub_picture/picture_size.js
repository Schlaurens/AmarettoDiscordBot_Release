module.exports = {
    name:'picture_size',
    async execute(interaction, timeStamp, pictures_model) {

        let picture_count = await pictures_model.count();

        await interaction.reply(`Wir haben **${picture_count} Bilder**.`);
        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} printed out the number of pictures. Count: ${picture_count}`);
    }
}