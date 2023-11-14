import { Client } from "discord.js";
import { deployCommands } from "../deploy-commands";

export default (client: Client): void => {
	client.on("guildCreate", async (guild) => {
		await deployCommands({ guildId: guild.id });
	});
};
