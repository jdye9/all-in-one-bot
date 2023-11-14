import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import { GuildConfiguration, Poll } from "../models";
import { formatResults } from "../utils";

export const data = new SlashCommandBuilder()
	.setName("poll")
	.setDescription("Start a poll")
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
			.setTitle("Create a poll")
			.setCustomId(`poll-${interaction.user.id}`);

		const textInput = new TextInputBuilder()
			.setCustomId("poll-input")
			.setLabel("What would you like to vote on?")
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)
			.setMaxLength(1000);

		const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
			textInput
		);

		modal.addComponents(actionRow);

		await interaction.showModal(modal);

		const filter = () => modal.data.custom_id === `poll-${interaction.user.id}`;

		const modalInteraction = await interaction
			.awaitModalSubmit({ filter, time: 1000 * 60 * 3 })
			.catch((err) => console.log(err));

		if (modalInteraction) {
			await modalInteraction.deferReply({ ephemeral: true });

			const pollMessage = await interaction.channel
				?.send(`Creating a poll for ${interaction.user}, please hold on... ✍️`)
				.catch(() => {
					modalInteraction?.editReply(
						"Failed to create poll in this channel, there may be a problem with my permissions. 😞"
					);
					return;
				});

			if (pollMessage) {
				const pollText =
					modalInteraction.fields.getTextInputValue("poll-input");
				const newPoll = new Poll({
					authorId: interaction.user.id,
					guildId: interaction.guildId,
					messageId: pollMessage.id,
				});

				await newPoll.save();

				modalInteraction.editReply("Poll created successfully! 🗳");

				const pollEmbed = new EmbedBuilder()
					.setAuthor({
						name: interaction.user.tag,
						iconURL: interaction.user.displayAvatarURL({ size: 256 }),
					})
					.addFields([
						{ name: "🗳 Poll 🗳", value: pollText },
						{ name: "Status", value: "⏳ Pending" },
						{ name: "Votes", value: formatResults([], []) },
					])
					.setColor("Yellow");

				const upvoteButton = new ButtonBuilder()
					.setEmoji("⬆️")
					.setLabel("Upvote")
					.setStyle(ButtonStyle.Success)
					.setCustomId(`poll-${newPoll.messageId}-upvote`);

				const downvoteButton = new ButtonBuilder()
					.setEmoji("⬇️")
					.setLabel("Downvote")
					.setStyle(ButtonStyle.Danger)
					.setCustomId(`poll-${newPoll.messageId}-downvote`);

				const endButton = new ButtonBuilder()
					.setEmoji("⏱")
					.setLabel("End Voting")
					.setStyle(ButtonStyle.Secondary)
					.setCustomId(`poll-${newPoll.messageId}-end`);

				const buttonRow1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
					upvoteButton,
					downvoteButton
				);
				const buttonRow2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
					endButton
				);

				pollMessage?.edit({
					content: `${interaction.user} created a new poll!`,
					embeds: [pollEmbed],
					components: [buttonRow1, buttonRow2],
				});
			}
		}
	} catch (error) {
		interaction.channel?.send(
			"There was an error creating the poll, please try again..."
		);
		console.error(error);
	}
}
