import { Client } from "discord.js";
import { deployCommands } from "../deploy-commands";

export default (client: Client): void => {
	client.on("guildAvailable", async (guild) => {
		await deployCommands({ guildId: guild.id });
	});
};
