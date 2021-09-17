module.exports = {
    name: 'roast_remove',
    async execute(interaction, timeStamp, permissions, roast_model) {

        //Check permissions
        if (!permissions.check_permissions("roast_remove", interaction.member)) {
            await interaction.reply({content : '**Insufficient permissions.**', ephemeral: true});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} tried to add a roast but has insufficient permissions`);
        }
        
        const roast_id = interaction.options.get("id").value;

        let exists;
        try{
            exists = await roast_model.exists({_id : roast_id});
        }
        catch(err) {
            return await interaction.reply({content : "Invalid ID.", ephemeral: true});
        }

        try{
            if(exists) {
                await roast_model.deleteOne({_id : roast_id});
                await interaction.reply("Roast has been removed.");
                return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} removed a roast.`);
            }
            else {
                return await interaction.reply({content : "Invalid ID.", ephemeral: true});
            }
        }
        catch (err) {
            console.log(err);
        }

        return;
    }
}