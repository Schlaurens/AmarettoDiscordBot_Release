import { 
    SlashCommandSubcommandBuilder, 
    UserContextMenuCommandInteraction, 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    EmbedBuilder,
    GuildMember,
    User,
    Colors,
    MessageFlags 
} from 'discord.js';

const timeStamp = require('../lib/timeStamp.ts');

module.exports = {
    name: 'avatar',
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Show the avatar of the mentioned person.')
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("guild")
            .setDescription("Get the avatar of a guild member.")
            .addUserOption(option =>
                option.setName("member")
                .setDescription("The member you want to get the avatar of.")
                .setRequired(true)))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("user")
            .setDescription("Get the user avatar of a user or member.")
            .addUserOption(option =>
                option.setName("user")
                .setDescription("The user you want to get the avatar of.")
                .setRequired(true)))
    .setDMPermission(false),
    user_command: {
        "name": "Avatar",
        "type": 2
    },
	async execute(interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction, user_command=false) {

        // interaction is either a UserContextMenuCommandInteraction or a ChatInputCommandInteraction depending on user_command
        interaction = user_command ? interaction as UserContextMenuCommandInteraction : interaction as ChatInputCommandInteraction;

        const subcommand = !user_command ? (interaction as ChatInputCommandInteraction).options.getSubcommand() : undefined;
        let target;
        let user;

        // Check whether the type of command (user_command, user subcommand or guild subcommand)
        if(user_command) {
            target = (interaction as UserContextMenuCommandInteraction).targetMember;
            user = target?.user as User;

        } else if (subcommand === "guild") {
            target = interaction.options.getMember("member");

            // Message if the target is not in the guild
            if(!target) {
                const sEmbed = new EmbedBuilder()
                .setColor(Colors.DarkBlue)
                .setDescription(`Couldn't find user **${(interaction as ChatInputCommandInteraction).options.getUser("member")?.tag}**`)
                await interaction.reply({embeds: [sEmbed], flags: MessageFlags.Ephemeral});

                console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to view the avatar of an unknown user ${interaction.options.data[0]?.value ?? "Unknown"}.`);
                return
            }
            user = (target as GuildMember)?.user as User;
        } else if (subcommand === "user") {
            target = interaction.options.getUser("user");
            user = target as User;
        }

        const avatarEmbed = new EmbedBuilder()
            .setColor(Colors.DarkBlue)
            .setAuthor({name: (user?.tag as string) ?? "Unknown", iconURL: user?.displayAvatarURL() ?? "Unknown"})
            .setTitle("Avatar")
            .setImage((target as GuildMember | User)?.displayAvatarURL() + '?size=4096'); //Upscale image to size 4096

        await interaction.reply({embeds : [avatarEmbed]});

        console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} viewed ${user?.displayName ?? "Unknown"}'s avatar. user_command = ${user_command}`);
	},
};