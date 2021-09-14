module.exports = {
    name: 'roast_upload',
    execute(message, timeStamp, permissions, roasts_schema, fs, json_tools) {

        //Check Permissions
        if(!permissions.check_permissions("roast_upload", message.member)) {
            message.channel.send('Insufficient permissions.');
            console.log(`${timeStamp.getTimeStamp()} ${message.author.username} tried to upload a new roasts file but has insufficient permissions.`);
            return;
        }

        let file = message.attachments.first() ? message.attachments.first().attachment : null;
        json_tools.download_json(message, file, (data) => {

            //Validate JSON structure
            json_tools.validate_json(roasts_schema, data, (valid) => {
                if (valid) {
                    //Overwrite JSON
                    pictures = data;
                    fs.writeFileSync('./commands/json/roasts.json', JSON.stringify(pictures, null, 2));
                    message.channel.send("Die ursprünglichen Roasts wurden erfolgreich überschrieben.");
                    console.log(`${timeStamp.getTimeStamp()} ${message.author.username} uploaded a new JSON for roasts.`);
                    return;

                } else {
                    message.channel.send("Die Datei hat die falsche Struktur.");
                    return;
                }
            })
        })

        return;
    }
}