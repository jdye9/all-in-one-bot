const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const dirPath = path.resolve(__dirname, "./commands");

const getFiles = () => {
	const files = fs.readdirSync(dirPath, {
		withFileTypes: true,
	});
	let commandFiles = [];
	files.forEach((file) => {
		if (file.isDirectory()) {
			commandFiles = [...commandFiles, ...getFiles(`${dirPath}/${file.name}`)];
		} else if (file.name.endsWith(".js")) {
			commandFiles.push(`${dirPath}/${file.name}`);
		}
	});
	return commandFiles;
};

const getCommands = () => {
	let commands = new Collection();
	const commandFiles = getFiles();

	commandFiles.forEach((commandFile) => {
		const command = require(commandFile);
		commands.set(command.data.toJSON().name, command);
	});
	return commands;
};

module.exports = {
	getFiles,
	getCommands,
};
