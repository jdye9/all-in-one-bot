const { client } = require("../index.js");
const { getCommands } = require("../utils.js");

client.commands = getCommands("./commands");

module.exports = {
	name: "guildMemberAdd",
	async execute(member) {
		const welcomeRole = await member.guild.roles.fetch("1140764480893112362");
		await member.roles.add(welcomeRole);
		const welcomeChannel = await member.guild.channels.fetch(
			"1140764795478478878"
		);
		welcomeChannel.send(`Welcome to the server, ${member.user}!`);
	},
};
