module.exports = {
    name: 'roast_get',
    async execute(interaction, timeStamp, roast_model, get_roast) {
        
        const roast_size = await roast_model.count();
        const options = interaction.options;

        //Roast the author of message
        if (options._hoistedOptions.length == 0) { 
            const author = interaction.user.username;
            const random = Math.floor(Math.random() * roast_size);
            const roast_sentence = await get_roast(random);

            interaction.reply(roast_sentence["roast"].replace('$name$', author));
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} roasted himself/herself. Index: ${random}`);

        } 
        // Roast the mentioned person
        else if (options.get("member")) {
            const mentionName = options.get("member").user.username
            const mentionNameUpperCase = mentionName.replace(mentionName.substring(0, 1), mentionName.substring(0, 1).toUpperCase());

            const random = Math.floor(Math.random() * roast_size);
            const roast_sentence = await get_roast(random);

            interaction.reply(roast_sentence["roast"].replace('$name$', mentionNameUpperCase));
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} roasted ${mentionNameUpperCase} (Mention). Index: ${random}`);
        }
        //Roast the specified person (by name)
        else if (options.get("name")) {

            const name = interaction.options.get("name").value;

            const personUp = name.replace(name.substring(0, 1), name.substring(0, 1).toUpperCase()); //Make first letter of uppercase
            const random = Math.floor(Math.random() * roast_size);

            const roast_sentence = await get_roast(random);
            interaction.reply(roast_sentence["roast"].replace('$name$', personUp));

            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} roasted ${personUp} (no Mention). Index: ${random}`);
        }
    }
}