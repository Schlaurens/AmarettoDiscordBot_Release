import { 
    SlashCommandSubcommandBuilder, 
    Client,
    ChatInputCommandInteraction, 
    SlashCommandBuilder 
} from 'discord.js';

const { 
     Collection
} = require('discord.js');

const permissions = require('../lib/permissions.ts');
const roast_model = require('../models/roastSchema.ts');
const timeStamp = require('../lib/timeStamp.ts');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'roast',
    description: 'Roasts a certain person.',
    data: new SlashCommandBuilder()
        .setName('roast')
        .setDescription("Roasts a certain person.")
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("get")
            .setDescription("Roast somebody!")
            .addUserOption(option =>
                option.setName("member")
                .setDescription("The Person you want to roast.")
                .setRequired(false))
            .addStringOption(option =>
                option.setName("name")
                .setDescription("The name of the person you want to roast.")
                .setRequired(false)))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("add")
            .setDescription("Add a new roast.")
            .addStringOption(option =>
                option.setName("sentence")
                .setDescription("The roast. $name$ represents the name of the roastee.")
                .setRequired(true)))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("remove")
            .setDescription("Remove a roast by it's ID.")
            .addStringOption(option =>
                option.setName("id")
                .setDescription("The ID of the roast to be removed.")
                .setRequired(true)))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("list")
            .setDescription("Get a list of all roasts and their IDs."))
        .setDMPermission(false),   
    async execute(interaction: ChatInputCommandInteraction, client: Client, user_command = false) {

        //==== Command Handler ====
        var subcommands = new Collection();
        const subcommandFiles = fs.readdirSync(path.join(__dirname, '../commands/sub_roast/')).filter((file: string) => file.endsWith('.ts'));
        for (const file of subcommandFiles) {
            const command = require(path.join(__dirname, `/sub_roast/${file}`));
            subcommands.set(command.name, command);
        }

        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'add') await subcommands.get('roast_add').execute(interaction, timeStamp, permissions, roast_model);
        if (subcommand === 'remove') await subcommands.get('roast_remove').execute(interaction, timeStamp, permissions, roast_model);
        if (subcommand === 'get' || user_command) await subcommands.get('roast_get').execute(interaction, timeStamp, roast_model, get_roast);
        if (subcommand === 'list') await subcommands.get('roast_list').execute(interaction, timeStamp, client, roast_model); 
        

        //==== Functions ====
        /**
         * Returns the roast at the given index out of the database 
         * @param {*} index a random index
         * @returns the roast at the given index
         */
        async function get_roast(index: number) {
            try{
                let roast = await roast_model.findOne().skip(index);
                return roast;
            }
            catch(err) {
                console.log(err);
            }
        }
    }
}