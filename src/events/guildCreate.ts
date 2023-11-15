import { Client } from "discord.js";
import { deployCommands } from "../deploy-commands";

export default (client: Client): void => {
	client.on("guildCreate", async (guild) => {
		await deployCommands({ guildId: guild.id });
		guild.systemChannel?.send(
			`Hey there! If you are looking for a list of commands please type "/help". Also please make sure that I am at the top of the roles list in your server so you can harness the full extent of my power :)`
		);
	});
};
