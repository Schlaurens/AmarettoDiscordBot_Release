module.exports = {
    name: 'roast_get',
    async execute(interaction, timeStamp, roast_model, get_roast, user_command) {
        
        const roast_size = await roast_model.count();
        const options = interaction.options;

        //Roast the author of message
        if (options._hoistedOptions.length == 0) { 

            const author_name = interaction.member.nickname ? interaction.member.nickname : interaction.user.username;
            const random = Math.floor(Math.random() * roast_size);
            const roast_sentence = await get_roast(random);

            interaction.reply(roast_sentence["roast"].replace('$name$', author_name));
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} roasted himself/herself. Index: ${random}`);

        } 
        // Roast the mentioned person
        else if (options.get("member") || user_command) {

            let mention_name = undefined;

            
            if (user_command) {
                mention_name = options.getMember("user").nickname ? options.getMember("user").nickname : options.getMember("user").user.username;
            }
            else {
                mention_name = options.get("member").member.nickname ? options.get("member").member.nickname : options.get("member").user.username;
            }

            const mentionNameUpperCase = mention_name.replace(mention_name.substring(0, 1), mention_name.substring(0, 1).toUpperCase());

            const random = Math.floor(Math.random() * roast_size);
            const roast_sentence = await get_roast(random);

            interaction.reply(roast_sentence["roast"].replace('$name$', mentionNameUpperCase));
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} roasted ${mentionNameUpperCase} (Mention). Index: ${random}. user_command = ${user_command}`);
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