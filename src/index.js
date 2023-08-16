require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
	],
});
module.exports = { client };

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"));

eventFiles.forEach((eventFile) => {
	const filePath = path.join(eventsPath, eventFile);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
});

mongoose.connect(process.env.DATABASE_URL).then(() => {
	console.log("Connected to MongoDB");
	client.login(process.env.DISCORD_TOKEN);
});
