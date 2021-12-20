const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'haltStop',
    description: 'Saves all the roles of a given user in a database.',
    data: new SlashCommandBuilder()
        .setName('haltstop')
        .setDescription("Manage the roles database.")
        .addSubcommand(subcommand =>
            subcommand.setName("save")
            .setDescription("Saves all the roles of a given user in the database.")
            .addUserOption(option =>
                option.setName("member")
                .setDescription("Member whose roles should be saved.")
                .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("clear")
            .setDescription('Drops the whole role database.'))
        .addSubcommand(subcommand =>
            subcommand.setName("members")
            .setDescription("Lists all database entries.")),
    user_command: {
        "name": "HaltStop",
        "type": 2
    },
    async execute(interaction, timeStamp, fs, Discord, user_command){
        
        //Used to check permissions of a given member
        const permissions = require('../lib/permissions');
        const role_backup_model = require('../models/roleBackupSchema');

        //Permission Check
        if(!permissions.check_permissions("haltStop", interaction.member)) {
            await interaction.reply({content : '**Insufficient permissions.**', ephemeral : true});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.username} tried to backup roles but has insufficient permissions. user_command = ${user_command}`);
        }

        //==== Command Handler ====
        var subcommands = new Discord.Collection();
        const subcommandFiles = fs.readdirSync('./commands/sub_haltStop/').filter(file => file.endsWith('.js'));
        for (const file of subcommandFiles) {
            const command = require(`./sub_haltStop/${file}`);
            subcommands.set(command.name, command);
        }
        
        if(interaction.options._subcommand === 'clear') return await subcommands.get('haltStop_clear').execute(interaction, timeStamp, role_backup_model);
        if(interaction.options._subcommand === 'members') return await subcommands.get('haltStop_members').execute(interaction, timeStamp, role_backup_model);
        if(interaction.options._subcommand === 'save' || user_command) return await subcommands.get('haltStop_save').execute(interaction, timeStamp, role_backup_model, user_command);

    }
}