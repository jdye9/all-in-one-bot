const {
	SlashCommandBuilder,
	EmbedBuilder,
	ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("help menu for AIOBot"),
	async execute(interaction) {
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
				value: "**/help** - Opens AIOBot help menu",
				inline: false,
			})
			.setFooter({
				text: "Powered by AIOBot",
				iconURL: interaction.client.user.displayAvatarURL(),
			});

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};
