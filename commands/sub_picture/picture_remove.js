module.exports = {
    name:'picture_remove',
    async execute(interaction, timeStamp, permissions, pictures_model, search_by_name) {

        // Permission check
        if (!permissions.check_permissions("picture_remove", interaction.member)) {
            await interaction.reply({content: '**Insufficient permissions.**', ephemeral: true});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} tried to add a roast but has insufficient permissions`);
        }

        const title = interaction.options.get("title").value;
        var re = new RegExp(title.toLowerCase());
        
        search_by_name(re, title, async (picture) => {
            if(picture !== undefined) {
                let del_pic = await pictures_model.findOneAndDelete({name : picture["name"]});

                await interaction.reply(`**${picture["name"]}** has been removed.`);
                return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} removed a picture. Name: ${del_pic["name"]}.`);
            }
            else {
                return await interaction.reply({content: "Picture not found.", ephemeral:true});
            }
        })
    }
}