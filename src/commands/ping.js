const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with 'pong'"),

	async execute(interaction) {
		interaction.reply("pong");
	},
};
