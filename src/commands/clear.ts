import { 
  ChatInputCommandInteraction, 
  SlashCommandIntegerOption,
  SlashCommandChannelOption, 
  Collection, 
  Snowflake, 
  Message,
  GuildMember,
  PermissionResolvable,
  SlashCommandBuilder,
  MessageFlags 
} from 'discord.js';

const {
    PermissionFlagsBits,
} = require("discord.js");
  
module.exports = {
    name: 'clear',
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deletes a given number of messages.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option: SlashCommandIntegerOption) =>
        option
        .setName('amount')
        .setDescription('Amount of messages to be deleted')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true))
    .addChannelOption((option: SlashCommandChannelOption) =>
        option
        .setName("channel")
        .setDescription("The channel to clear messages from.")
        .setRequired(false))
    .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction, timeStamp: any){

        const channel: any = interaction.options.getChannel("channel") || interaction.channel;
        const numOfMessages = interaction.options.get("amount")?.value;

        const member = interaction.member as GuildMember;
        // ==== Permission Handler ====
        // Only members with 'MANAGE_MESSAGES' permissions in the channel can use /clear
        if(!member || (!member?.permissions.has('MANAGE_MESSAGES' as PermissionResolvable))) {
            await interaction.reply({content : "**Insufficient permissions.**", flags: MessageFlags.Ephemeral});
            console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to clear numOfMessages but has insufficient permissions.`);

            return;
        }

        await channel?.bulkDelete(numOfMessages, true).then((messages: Collection<Snowflake, Message>) => {

          if(messages.size == 0) {
            interaction.reply({ content: "No messages were deleted. Messages probably were older than 14 days.", flags: MessageFlags.Ephemeral })
            .catch(console.error);
            return;
          }

          interaction
          .reply({
            content: `Successfully cleared **${messages.size}** messages in **${channel.name}**.`,
            withResponse: true, 
          })
          .then((response) => {
            setTimeout(() => {
              response.resource?.message?.delete();
            }, 350);
          })
          .catch(console.error)

          return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} cleared ${messages.size} messages in channel: ${channel.name}.`);
        })
        .catch(console.error);
    
    }
}