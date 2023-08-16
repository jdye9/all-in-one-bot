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
		.setName("hello")
		.setDescription("Says hello to someone")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user to say hello to")
				.setRequired(false)
		),

	async execute(interaction) {
		const user = interaction.options.getUser("user") || interaction.user;
		interaction.reply(`Hello ${user.displayName}`);
	},
};
