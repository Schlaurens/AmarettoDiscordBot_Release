const roast = require('../roast');

module.exports = {
    name: 'roast_remove',
    async execute(message, timeStamp, args, permissions) {

        const roast_model = require('../../models/roastSchema');

        //Check permissions
        if (!permissions.check_permissions("roast_remove", message.member)) {
            message.channel.send('Insufficient permissions.');
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to add a roast but has insufficient permissions`);
            return;
        }
        
        if(!args[2]) {
            message.channel.send("Bitte gib den Index von dem zu löschenden Roast an.");
            return;
        }
        try{
            if(await roast_model.exists({_id : args[2]})) {
                await roast_model.deleteOne({_id : args[2]});
                message.channel.send("Roast wurde erfolgreich entfernt.")
                console.log(`${timeStamp.getTimeStamp()} ${message.author.username} removed a roast.`);
                return;
            }
            else {
                message.channel.send("Ungültige ID");
                return;
            }
        }
        catch (err) {
            console.log(err);
        }

        return;
    }
}