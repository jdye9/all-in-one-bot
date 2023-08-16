require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const { getFiles } = require("./utils");

let commands = [];
const commandFiles = getFiles("./commands");

commandFiles.forEach((commandFile) => {
	const command = require(commandFile);
	commands.push(command.data.toJSON());
});

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
rest
	.put(
		Routes.applicationGuildCommands(
			process.env.CLIENT_ID,
			process.env.GUILD_ID
		),
		{ body: commands }
	)
	.then(() => console.log("Successfully registered application commands"))
	.catch((err) => console.log(err));
