// Code inspired by the B-Human B-ot (closed source)
import { 
  SlashCommandSubcommandBuilder, 
  ChatInputCommandInteraction, 
  Client,
  PresenceStatusData,
  SlashCommandBuilder,
  EmbedBuilder,
  ActivityType 
} from 'discord.js';

const {
  PermissionFlagsBits,
} = require("discord.js");

const timeStamp = require('../lib/timeStamp.ts');

module.exports = {
  name: "update",
  description: "Updates Amaretto's presence.",
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Updates Amaretto's presence.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName("activity")
        .setDescription("Updates Amaretto's activity.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("The type of activity.")
            .setRequired(true)
            .addChoices(
              { name: "Playing", value: "Playing" },
              { name: "Streaming", value: "Streaming" },
              { name: "Listening", value: "Listening" },
              { name: "Watching", value: "Watching" },
              { name: "Competing", value: "Competing" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("activity")
            .setDescription("The activity.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName("status")
        .setDescription("Updates Amaretto's status.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("The type of status.")
            .setRequired(true)
            .addChoices(
              { name: "Online", value: "online" },
              { name: "Idle", value: "idle" },
              { name: "Do not disturb", value: "dnd" },
              { name: "Invisible", value: "invisible" }
            )
        )
    ),
    async execute(interaction: ChatInputCommandInteraction, client: Client) {

      const options = interaction.options;
      const status = options.getSubcommand();
      const type = options.getString("type") as string;
      const activity = options.getString("activity") as string;

      try {
        switch (status) {
          case "activity":
            switch (type) {
              case "Playing":
                if (client.user) {
                  client.user.setActivity(activity, { 
                    type: ActivityType.Playing 
                  });
                }
                break;
              case "Streaming":
                if (client.user) {
                  client.user.setActivity(activity, {
                    type: ActivityType.Streaming,
                  });
                }
                break;
              case "Listening":
                if (client.user) {
                  client.user.setActivity(activity, {
                    type: ActivityType.Listening,
                  });
                }
                break;
              case "Watching":
                if (client.user) {
                  client.user.setActivity(activity, {
                    type: ActivityType.Watching,
                  });
                }
                break;
              case "Competing":
                if (client.user) {
                  client.user.setActivity(activity, {
                    type: ActivityType.Competing,
                  });
                }
                break;
            }
            break;
          case "status":
            if (client.user) { 
              client.user.setPresence({status: type as PresenceStatusData});
            }
            break;
        }
      } catch (err) {
        console.log(err);
      }

      const embed = new EmbedBuilder();
      embed.setTitle("Presence updated");
      embed.setColor("#71368A");
      embed.setDescription(`Successfully updated your ${status} to **${type}**.`);

      await interaction.reply({ embeds: [embed], ephemeral: true });

      return console.log(`${timeStamp.getTimeStamp()} ${interaction.user.displayName} updated Amaretto's ${status} to ${type}.`);
    }
}
