const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'clear',
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deletes a given number of messages.')
    .addNumberOption(option =>
        option
        .setName('amount')
        .setDescription('Amount of messages to be deleted')
        .setRequired(true))
    .addBooleanOption(option => 
        option.setName("old")
        .setDescription('Remove messages which are older than 14 days.')
        .setRequired(false)),

    async execute(interaction, timeStamp){

        var numOfMessages = interaction.options.get("amount").value;

        // ==== Permission Handler ====
        // Only members with 'MANAGE_MESSAGES' permissions in the channel can use /clear
        if(!interaction.member.permissions.has('MANAGE_MESSAGES')) {

            await interaction.reply({content : "**Insufficient permissions.**", ephemeral: true});
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} tried to clear numOfMessages but has insufficient permissions.`);

            return;
        }

        // ==== Condition checking ====
        if(numOfMessages >= 100) return interaction.reply({content: "Cannot delete more than 99 messages at once.", ephemeral : true}); // for safety
        if(numOfMessages < 1) return interaction.reply({content: "You have to delete at least one message.", ephemeral: true});
        
        
        interaction.channel.bulkDelete(numOfMessages, interaction.options.get("old"))
        .then(async messages => {
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} deleted ${messages.size} messages in the channel '${interaction.channel.name}'. old = ${interaction.options.get("old")}`);
            await interaction.reply({content: "**Success!**", ephemeral : false})
            await interaction.deleteReply()
            
        })
        .catch(async err => {
            await interaction.reply("Cannot delete messages which are older than 14 days.")
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} tried to delete ${numOfMessages} message in the channel '${interaction.channel.name}' but the message was older than 14 days`)
        });
    }
}