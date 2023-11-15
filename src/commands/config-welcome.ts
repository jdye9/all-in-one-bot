import {
	ChannelType,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";
import { GuildConfiguration } from "../models";

export const data = new SlashCommandBuilder()
	.setName("config-welcome")
	.setDescription("Configuration for welcome message")
	.setDMPermission(false)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("add-channel")
			.setDescription("Add a welcome channel")
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
			.setName("remove-channel")
			.setDescription("Remove a welcome channel")
			.addChannelOption((option) =>
				option
					.setName("channel")
					.setDescription("The channel to be removed")
					.addChannelTypes(ChannelType.GuildText)
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("add-role")
			.setDescription("Add a welcome role")
			.addRoleOption((option) =>
				option
					.setName("role")
					.setDescription("The welcome role to be added")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("remove-role")
			.setDescription("Remove a welcome role")
			.addRoleOption((option) =>
				option
					.setName("role")
					.setDescription("The welcome role to be removed")
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

	if (subcommand === "add-channel") {
		const channel = interaction.options.getChannel("channel");
		if (channel) {
			if (guildConfiguration.welcomeChannelIds.includes(channel.id)) {
				interaction.reply(
					`${channel} is already designated as a welcome channel`
				);
				return;
			}
			guildConfiguration.welcomeChannelIds.push(channel.id);
			await guildConfiguration.save();
			interaction.reply(`Designated ${channel} as a welcome channel`);
			return;
		}
	}

	if (subcommand === "remove-channel") {
		const channel = interaction.options.getChannel("channel");
		if (channel) {
			if (!guildConfiguration.welcomeChannelIds.includes(channel.id)) {
				interaction.reply(
					`${channel} is not currently designated as a welcome channel`
				);
				return;
			}
			guildConfiguration.welcomeChannelIds =
				guildConfiguration.welcomeChannelIds.filter((id) => id !== channel.id);
			await guildConfiguration.save();
			interaction.reply(`Removed ${channel} from welcome channels`);
			return;
		}
	}

	if (subcommand === "add-role") {
		const role = interaction.options.getRole("role");
		if (role) {
			if (guildConfiguration.welcomeRoleIds.includes(role.id)) {
				interaction.reply(`${role} is already designated as a welcome role`);
				return;
			}
			guildConfiguration.welcomeRoleIds.push(role.id);
			await guildConfiguration.save();
			interaction.reply(`Designated ${role} as a welcome role`);
			return;
		}
	}

	if (subcommand === "remove-role") {
		const role = interaction.options.getRole("role");
		if (role) {
			if (!guildConfiguration.welcomeRoleIds.includes(role.id)) {
				interaction.reply(
					`${role} is not currently designated as a welcome role`
				);
				return;
			}
			guildConfiguration.welcomeRoleIds =
				guildConfiguration.welcomeRoleIds.filter((id) => id !== role.id);
			await guildConfiguration.save();
			interaction.reply(`Removed ${role} from welcome roles`);
			return;
		}
	}
}
