import { ChatInputCommandInteraction, Client } from "discord.js";
import { commands } from "../../commands";
import { handleVote } from "./handleVote";
import { handleParty } from "./handleParty";

export default (client: Client): void => {
	client.on("interactionCreate", async (interaction) => {
		if (interaction.isButton() && interaction.customId.includes("poll")) {
			handleVote(interaction);
			return;
		}

		if (interaction.isButton() && interaction.customId.includes("party")) {
			handleParty(interaction);
			return;
		}

		if (!interaction.isCommand()) {
			return;
		}
		const { commandName } = interaction;
		if (commands[commandName as keyof typeof commands]) {
			commands[commandName as keyof typeof commands].execute(
				interaction as ChatInputCommandInteraction
			);
		}
	});
};
