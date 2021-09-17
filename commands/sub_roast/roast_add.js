module.exports = {
    name: 'roast_add',
    async execute(interaction, timeStamp, permissions, roast_model) {


        //Check permissions
        if(!permissions.check_permissions("roast_add", interaction.member)) {
            await interaction.reply({content : '**Insufficient permissions.**', ephemeral: true});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} tried to add a roast but has insufficient permissions`);
        }

        
        const roastSentence = interaction.options.get("sentence").value;

        // Check whether roast is too long (> 1024 characters)
        if (roastSentence.length > 1024) {
            return await interaction.reply({content : "Roast cannot be longer than 1024", ephemeral: true});
        }
        
        //Check whether roast already exists
        try{
            if(await roast_model.exists({roast : roastSentence})) {
                return await interaction.reply({content : "Roast already exists.", ephemeral:true});
            }
        }
        catch (err){
            console.log(err);
        }

        // get size of roast database
        const index = await roast_model.count();

        let roast = await roast_model.create({
            roast: roastSentence
        });
        roast.save();

        await interaction.reply("Roast added.");

        return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} added a new roast. Index: ${index}`);
    }
}