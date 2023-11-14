require("dotenv").config();
import { Client, GatewayIntentBits } from "discord.js";
import { events } from "./events";
import mongoose from "mongoose";
import { config } from "./config";

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
	],
});

events.forEach((event) => {
	event.default(client);
});

const connect = async () => {
	await mongoose
		.connect(config.DATABASE_URL, {
			dbName: "AIOBot",
		})
		.then(() => {
			console.log("Connected to MongoDB");
			client.login(process.env.DISCORD_TOKEN);
		});
};

connect();
