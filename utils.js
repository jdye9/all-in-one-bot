const { Collection } = require("discord.js");
const fs = require("fs");

const getFiles = (dir) => {
	const files = fs.readdirSync(dir, {
		withFileTypes: true,
	});
	let commandFiles = [];
	files.forEach((file) => {
		if (file.isDirectory()) {
			commandFiles = [...commandFiles, ...getFiles(`${dir}/${file.name}`)];
		} else if (file.name.endsWith(".js")) {
			commandFiles.push(`${dir}/${file.name}`);
		}
	});
	return commandFiles;
};

const getCommands = (dir) => {
	let commands = new Collection();
	const commandFiles = getFiles(dir);

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
