const { client } = require("../index.js");
const { getCommands } = require("../utils.js");

client.commands = getCommands("./commands");

module.exports = {
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
