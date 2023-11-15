import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ModalBuilder,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { GuildConfiguration } from "../models";
import { Party } from "../models/Party";
import { formatResultsParty } from "../utils";

export const data = new SlashCommandBuilder()
	.setName("party")
	.addNumberOption((option) =>
		option
			.setName("party-size")
			.setDescription("Size of Party")
			.setRequired(true)
	)
	.setDescription("Start a party for gaming")
	.setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
	try {
		const guildConfiguration = await GuildConfiguration.findOne({
			guildId: interaction.guildId,
		});
		if (!guildConfiguration?.pollChannelIds.length) {
			interaction.reply(
				"This server has not been configured for polling yet.\nPlease ask an administrator to run **/config-poll add** to do so."
			);
			return;
		}
		if (!guildConfiguration?.pollChannelIds.includes(interaction.channelId)) {
			interaction.reply(
				`This server has not been configured for polling yet. Try one of these channels instead:\n${guildConfiguration?.pollChannelIds
					.map((id) => `<#${id}>`)
					.join(
						" "
					)}\nOr, ask an administrator to run **/config-poll add** to add this channel.`
			);
			return;
		}

		const modal = new ModalBuilder()
			.setTitle("Create a party")
			.setCustomId(`party-${interaction.user.id}`);

		const textInput = new TextInputBuilder()
			.setCustomId("party-input")
			.setLabel("What kind of party are you trying to start?")
			.setStyle(TextInputStyle.Short)
			.setRequired(true)
			.setMaxLength(1000);

		const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
			textInput
		);

		modal.addComponents(actionRow);

		await interaction.showModal(modal);

		const filter = () =>
			modal.data.custom_id === `party-${interaction.user.id}`;

		const modalInteraction = await interaction
			.awaitModalSubmit({ filter, time: 1000 * 60 * 3 })
			.catch((err) => console.log(err));

		if (modalInteraction) {
			await modalInteraction.deferReply({ ephemeral: true });

			const partyMessage = await interaction.channel
				?.send(`Creating a party for ${interaction.user}, please hold on... ✍️`)
				.catch(() => {
					modalInteraction?.editReply(
						"Failed to create party in this channel, there may be a problem with my permissions. 😞"
					);
					return;
				});

			if (partyMessage) {
				const partyText =
					modalInteraction.fields.getTextInputValue("party-input");
				const newParty = new Party({
					authorId: interaction.user.id,
					guildId: interaction.guildId,
					messageId: partyMessage.id,
					partySize: interaction.options.getNumber("party-size"),
				});
				await newParty.save();

				modalInteraction.editReply("Party created successfully! 🗳");

				const partyEmbed = new EmbedBuilder()
					.setAuthor({
						name: interaction.user.tag,
						iconURL: interaction.user.displayAvatarURL({ size: 256 }),
					})
					.addFields([
						{ name: "🎮 Party 🎮", value: partyText },
						{ name: "Status", value: "Open" },
						{ name: "Party Members", value: "N/A" },
						{
							name: "Spaces Taken",
							value: formatResultsParty(
								[],
								interaction.options.getNumber("party-size") || 0
							),
						},
					])
					.setColor("Grey");

				const joinButton = new ButtonBuilder()
					.setEmoji("⬆️")
					.setLabel("Join")
					.setStyle(ButtonStyle.Success)
					.setCustomId(`party-${newParty.messageId}-join`);

				const leaveButton = new ButtonBuilder()
					.setEmoji("⬇️")
					.setLabel("Leave")
					.setStyle(ButtonStyle.Danger)
					.setCustomId(`party-${newParty.messageId}-leave`);

				const buttonRow1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
					joinButton,
					leaveButton
				);

				partyMessage?.edit({
					content: `${interaction.user} created a new party!`,
					embeds: [partyEmbed],
					components: [buttonRow1],
				});
			}
		}
	} catch (error) {
		interaction.channel?.send(
			"There was an error creating the party, please try again..."
		);
		console.error(error);
	}
}
