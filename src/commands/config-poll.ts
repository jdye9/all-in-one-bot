import {
	SlashCommandBuilder,
	ChannelType,
	ChatInputCommandInteraction,
} from "discord.js";
import { GuildConfiguration } from "../models/GuildConfiguration";

export const data = new SlashCommandBuilder()
	.setName("config-poll")
	.setDescription("Configuration for polling")
	.setDMPermission(false)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("add")
			.setDescription("Add a polling channel")
			.addChannelOption((option) =>
				option
					.setName("channel")
					.setDescription("The channel to be added")
					.addChannelTypes(ChannelType.GuildText)
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("remove")
			.setDescription("Remove a polling channel")
			.addChannelOption((option) =>
				option
					.setName("channel")
					.setDescription("The channel to be removed")
					.addChannelTypes(ChannelType.GuildText)
					.setRequired(true)
			)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	let guildConfiguration = await GuildConfiguration.findOne({
		guildId: interaction.guildId,
	});
	if (!guildConfiguration) {
		guildConfiguration = new GuildConfiguration({
			guildId: interaction.guildId,
		});
	}

	const subcommand = interaction.options.getSubcommand();

	if (subcommand === "add") {
		const channel = interaction.options.getChannel("channel");
		if (channel) {
			if (guildConfiguration.pollChannelIds.includes(channel.id)) {
				interaction.reply(
					`${channel} is already designated as a polling channel`
				);
				return;
			}
			guildConfiguration.pollChannelIds.push(channel.id);
			await guildConfiguration.save();
			interaction.reply(`Designated ${channel} as a polling channel`);
			return;
		}
	}

	if (subcommand === "remove") {
		const channel = interaction.options.getChannel("channel");
		if (channel) {
			if (!guildConfiguration.pollChannelIds.includes(channel.id)) {
				interaction.reply(
					`${channel} is not currently designated as a polling channel`
				);
				return;
			}
			guildConfiguration.pollChannelIds =
				guildConfiguration.pollChannelIds.filter((id) => id !== channel.id);
			await guildConfiguration.save();
			interaction.reply(`Removed ${channel} from polling channels`);
			return;
		}
	}
}
