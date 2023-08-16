const {
	SlashCommandBuilder,
	ChannelType,
	ChatInputCommandInteraction,
} = require("discord.js");
const GuildConfiguration = require("../models/GuildConfiguration");

module.exports = {
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	data: new SlashCommandBuilder()
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
		),
	async execute(interaction) {
		const guildConfiguration = await GuildConfiguration.findOne({
			guildId: interaction.guildId,
		});
		if (!guildConfiguration) {
			guildConfiguration = new GuildConfiguration({
				guildId: interaction.guildId,
			});
		}

		const subcommand = interaction.options.getSubcommand();
	},
};
