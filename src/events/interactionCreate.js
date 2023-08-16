const { client } = require("../index.js");
const { getCommands } = require("../utils.js");
const { ChatInputCommandInteraction } = require("discord.js");

client.commands = getCommands();

module.exports = {
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	name: "interactionCreate",
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		let command = client.commands.get(interaction.commandName);

		try {
			if (interaction.replied) return;
			command.execute(interaction);
		} catch (err) {
			console.error(err);
		}
	},
};
