import { 
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder, 
    ChatInputCommandInteraction 
} from 'discord.js';

const { 
    Collection 
} = require('discord.js');

const timeStamp = require('../lib/timeStamp.ts');
const permissions = require('../lib/permissions');
const role_backup_model = require('../models/roleBackupSchema');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'haltStop',
    description: 'Saves all the roles of a given user in a database.',
    data: new SlashCommandBuilder()
        .setName('haltstop')
        .setDescription("Manage the roles database.")
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("save")
            .setDescription("Saves all the roles of a given user in the database.")
            .addUserOption(option =>
                option.setName("member")
                .setDescription("Member whose roles should be saved.")
                .setRequired(true)))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("clear")
            .setDescription('Drops the whole role database.'))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("members")
            .setDescription("Lists all database entries."))
            .setDMPermission(false),
    user_command: {
        "name": "HaltStop",
        "type": 2
    },
    async execute(interaction: ChatInputCommandInteraction, user_command = false){

        //Permission Check
        if(!permissions.check_permissions("haltStop", interaction.member)) {
            await interaction.reply({content : '**Insufficient permissions.**', ephemeral : true});
            return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} tried to use the haltStop command has insufficient permissions. user_command = ${user_command}`);
        }

        //==== Command Handler ====
        var subcommands = new Collection();
        const subcommandFiles = fs.readdirSync(path.join(__dirname, '../commands/sub_haltStop/')).filter((file: string) => file.endsWith('.ts'));
        for (const file of subcommandFiles) {
            const command = require(path.join(__dirname, `/sub_haltStop/${file}`));
            subcommands.set(command.name, command);
        }
        
        const subcommand = !user_command ? interaction.options.getSubcommand() : undefined;
        if(subcommand === 'clear') return await subcommands.get('haltStop_clear').execute(interaction, timeStamp, role_backup_model);
        if(subcommand === 'members') return await subcommands.get('haltStop_members').execute(interaction, timeStamp, role_backup_model);
        if(subcommand === 'save' || user_command) return await subcommands.get('haltStop_save').execute(interaction, timeStamp, role_backup_model, user_command);
    }
}