import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("echo")
	.setDescription("repeats what you say")
	.addStringOption((option) =>
		option.setName("text").setDescription("The text to echo").setRequired(true)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	const text = interaction.options.getString("text");
	interaction.reply(`${text}`);
}
