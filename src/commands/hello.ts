import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("hello")
	.setDescription("Says hello to someone")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to say hello to")
			.setRequired(false)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	const user = interaction.user;
	interaction.reply(`Hello ${user.displayName}`);
}
