module.exports = {
    name:'picture_rename',
    async execute(interaction, timeStamp, permissions, pictures_model, search_by_name) {

        // Permission check
        if (!permissions.check_permissions("picture_rename", interaction.member)) {
            await interaction.reply({content: '**Insufficient permissions.**', ephemeral: true});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} tried rename a picture but has insufficient permissions`);
        }

        const current_title = interaction.options.get("current_title").value;
        const new_title = interaction.options.get("new_title").value;

        const re = new RegExp(current_title);
        
        // RegEx: Case insensitive
        const count_picture = await pictures_model.count({name : { $regex: new RegExp('^'+ new_title + '$', "i")}})

        // Search picture
        search_by_name(re, current_title, async (picture) => {
            if(picture === undefined) {
                return await interaction.reply({content: "Picture not found.", ephemeral: true});
            }

            // If a picture with the new_title already exists. The picture to be changed is excluded from this.
            if(count_picture > 1 || (count_picture == 1 && picture["name"].toLowerCase() !== new_title.toLowerCase())) {
                return await interaction.reply({content: `**${new_title}** is already taken.`, ephemeral: true});
            }

            await pictures_model.updateOne(picture, {$set: {name : new_title}});
            await interaction.reply({content: "Picture has been renamed"});

            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} renamed a picture. old_title: ${current_title}, new_title: ${new_title}`);
        })



            
        
        
    }
}