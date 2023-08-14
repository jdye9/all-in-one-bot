const { client } = require("../index.js");
const { getCommands } = require("../utils.js");

client.commands = getCommands("./commands");

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		console.log(`Logged in as as ${client.user.tag}`);
	},
};
