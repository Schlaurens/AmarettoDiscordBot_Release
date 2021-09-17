module.exports = {
    name:'picture_get',
    async execute(interaction, timeStamp, pictures_model, search_by_name) {

        let pictures_count = await pictures_model.count();
        const index_option = interaction.options.get("index");

        if (index_option && index_option.value <= pictures_count) {

            let picture = await pictures_model.findOne().skip(index_option.value);

            await interaction.reply(`Title: **${picture["name"]}**   ${picture["url"]}`);
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} requested a picture and got: ${picture["name"]}`);
        }
        //Send a specified picture (search by name)
        else if (interaction.options.get('title')) {
            const title = interaction.options.get("title").value;

            var re = new RegExp(title.toLowerCase());

            search_by_name(re, title, async (picture) => {
                if (picture !== undefined) {
                    await interaction.reply(`Title: **${picture["name"]}**   ${picture["url"]}`);
                    console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} requested a picture and got: ${picture["name"]}`);
                    return;
                }
                return await interaction.reply({content : 'Picture not found.', ephemeral: true});
            });
        }

        //Send a random picture
        else {

            var random = Math.floor(Math.random() * pictures_count);

            // Get picture from database
            let picture = await pictures_model.findOne().skip(random);

            // Send picture
            await interaction.reply(`Title: **${picture["name"]}**   ${picture["url"]}`);
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} requested a picture and got: ${picture["name"]}`);
        }
    }
}