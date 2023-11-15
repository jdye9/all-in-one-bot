import {
	SlashCommandBuilder,
	EmbedBuilder,
	ChatInputCommandInteraction,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("help")
	.setDescription("help menu for AIOBot");

export async function execute(interaction: ChatInputCommandInteraction) {
	const embed = new EmbedBuilder()
		.setTitle("Help Menu - AIOBot")
		.setColor("Green")
		.setAuthor({
			name: interaction.user.tag,
			iconURL: interaction.user.displayAvatarURL(),
		})
		.setTimestamp()
		.addFields({
			name: "About",
			value: "Created to do a bunch of random things",
			inline: false,
		})
		.addFields({
			name: "Commands",
			value:
				"**/help** - Opens AIOBot help menu\n**/config-welcome** - Set welcome channel and role settings\n**/config-poll** - Set channel for parties and polls\n**/poll** - Create a poll\n**/party** - Create a party",
			inline: false,
		})
		.setFooter({
			text: "Powered by AIOBot",
			iconURL: interaction.client.user.displayAvatarURL(),
		});

	interaction.reply({
		embeds: [embed],
		ephemeral: true,
	});
}
