import { 
    SlashCommandSubcommandBuilder, 
    Client, 
    ChatInputCommandInteraction,
    SlashCommandBuilder, 
} from 'discord.js';

const { 
    Collection 
} = require('discord.js');

const permissions = require('../lib/permissions.ts');
const pictures_model = require('../models/picturesSchema.ts');
const fs = require('fs');
const timeStamp = require('../lib/timeStamp');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('picture')
    .setDescription("Posts funny pictures of the squad.")
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
        subcommand.setName("get")
        .setDescription("Get a funny picture.")
        .addStringOption(option =>
            option.setName("title")
            .setDescription("The title of the picture you want. (RegEx also works)")
            .setRequired(false))
        .addNumberOption(option => 
            option.setName("index")
            .setDescription("The index of picture you want.")
            .setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) => 
        subcommand.setName('save')
        .setDescription("Saves a given picture in the pictures directory")
        .addStringOption(option =>
            option.setName('url')
            .setDescription('url of the picture.')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('title')
            .setDescription('Title of the picture.')
            .setRequired(true)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
        subcommand.setName("size")
        .setDescription("Get the amount of picture in the database."))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
        subcommand.setName("remove")
        .setDescription("Removes a picture from the database.")
        .addStringOption(option => 
            option.setName("title")
            .setDescription("The title of the picture to be removed.")
            .setRequired(true)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
        subcommand.setName("list")
        .setDescription("Get a list of all pictures."))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
        subcommand.setName("rename")
        .setDescription("Rename a picture.")
        .addStringOption(option =>
            option.setName("current_title")
            .setDescription("The current title of the picture.")
            .setRequired(true))
        .addStringOption(option =>
            option.setName("new_title")
            .setDescription("The new title for the picture.")
            .setRequired(true)))
    .setDMPermission(false),
    name: 'picture',
    description: 'Posts funny pictures of the squad',
    async execute(interaction: ChatInputCommandInteraction, client: Client) {

        //==== Command Handler ====
        var subcommands = new Collection();
        const subcommandFiles = fs.readdirSync(path.join(__dirname, '../commands/sub_picture/')).filter((file: string) => file.endsWith('.ts'));
        for (const file of subcommandFiles) {
            const command = require(path.join(__dirname, `/sub_picture/${file}`));
            subcommands.set(command.name, command);
        }

        const subcommand = interaction.options.getSubcommand();
        if(subcommand === 'get') return await subcommands.get('picture_get').execute(interaction, timeStamp, pictures_model, search_by_name);
        if(subcommand === 'save') return await subcommands.get('picture_save').execute(interaction, timeStamp, permissions, pictures_model);
        if(subcommand === 'size') return await subcommands.get('picture_size').execute(interaction, timeStamp, pictures_model);
        if(subcommand === 'remove') return await subcommands.get('picture_remove').execute(interaction, timeStamp, permissions, pictures_model, search_by_name);
        if(subcommand === 'list') return await subcommands.get('picture_list').execute(interaction, timeStamp, client, pictures_model);
        if(subcommand === 'rename') return await subcommands.get('picture_rename').execute(interaction, timeStamp, permissions, pictures_model);
        
        
        //======== Functions ========
        /**
         * Search a picture with RegEx
         * @param {*} re the given RegEx
         * @param {*} callback callback function called with the picture's index.
         */
        async function search_by_name(re: string, name: string, callback: any) {

            const pictures_model = require('../models/picturesSchema')

            // Contains parts of title 
            if (await pictures_model.exists({name : { $regex: name, $options: "i"}})) {
                return callback(await pictures_model.findOne({name : { $regex: name, $options: "i"}}));
            }
            // Full title case insensitive
            else if (await pictures_model.exists({name : { $regex: new RegExp('^'+ name + '$', "i")}})) {
                return callback(await pictures_model.findOne({name : { $regex: new RegExp('^'+ name + '$', "i")}}));
            }
            // Pure regex
            if(await pictures_model.exists({name : {$regex: re}})) {
                return callback(await pictures_model.findOne({name : {$regex: re}}));
            }
            return callback();
        }
    }
}