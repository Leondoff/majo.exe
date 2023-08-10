import { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } from "discord.js";
import figlet from "figlet";

export default {
 name: "ascii",
 description: "✍️ Convert text to ASCII",
 type: ApplicationCommandType.ChatInput,
 cooldown: 5000,
 dm_permission: false,
 usage: "/ascii <text>",
 options: [
  {
   name: "text",
   description: "The text to convert",
   required: true,
   type: ApplicationCommandOptionType.String,
   max_length: 500,
  },
 ],
 run: async (client, interaction, guildSettings) => {
  try {
   const text = interaction.options.getString("text");

   figlet(text, (err, data) => {
    if (err) {
     const embed = new EmbedBuilder()
      .setColor("#EF4444")
      .setTimestamp()
      .setTitle("❌ Something went wrong")
      .setDescription("> An error occurred while converting the text to ASCII")
      .setFooter({
       text: `Requested by ${interaction.member?.user?.username}`,
       iconURL: interaction.member?.user?.displayAvatarURL({
        dynamic: true,
        format: "png",
        size: 2048,
       }),
      });
     return interaction.followUp({ ephemeral: true, embeds: [embed] });
    }

    const embed = new EmbedBuilder()
     .setColor(guildSettings?.embedColor || client.config.defaultColor)
     .setTimestamp()
     .setTitle(`${client.config.emojis.success} Your ascii code has been successfully generated!`)
     .setFooter({
      text: `Requested by ${interaction.member?.user?.username}`,
      iconURL: interaction.member?.user?.displayAvatarURL({
       dynamic: true,
       format: "png",
       size: 2048,
      }),
     });

    const attached = new AttachmentBuilder().setName("ascii.txt").setFile(Buffer.from(data));

    return interaction.followUp({ ephemeral: false, embeds: [embed], files: [attached] });
   });
  } catch (err) {
   client.errorMessages.generateErrorMessage(interaction, err);
  }
 },
};
