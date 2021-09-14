module.exports = {
    name: 'roast_add',

    async execute(message, timeStamp, args, fs, permissions, roasts) {

        const roast_model = require('../../models/roastSchema');

        //Check permissions
        if(!permissions.check_permissions("roast_add", message.member)) {
            message.channel.send('Insufficient permissions.');
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to add a roast but has insufficient permissions`);
            return;
        }

        if(!args[2]) {
            message.channel.send("Bitte gib einen Roast an.")
            return;
        }

        //Remove first two elements from array
        let roastSentence = args.splice(2).join(' ');

        //Check whether roast already exists
        try{
            if(await roast_model.exists({roast : roastSentence})) {
                message.channel.send("Dieser Roast existiert bereits.")
                return; 
            }
        }
        catch (err){
            console.log(err);
        }

        // get amount of roast 
        let index = await roast_model.count();

        let roast = await roast_model.create({
            roast: roastSentence
        });

        roast.save();

        message.channel.send("Der Roast wurde erfolgreich hinzugefügt.");

        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} added a new roast. Index: ${index}`);

        return;
    }
}