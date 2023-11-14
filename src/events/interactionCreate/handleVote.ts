import { ButtonInteraction, ColorResolvable, EmbedBuilder } from "discord.js";
import { Poll } from "../../models";
import { formatResults } from "../../utils";

export const handleVote = async (interaction: ButtonInteraction) => {
	if (!interaction.isButton() || !interaction.customId) return;
	try {
		const [type, messageId, action] = interaction.customId.split("-");
		if (!type || !messageId || !action) return;
		if (type !== "poll") return;
		await interaction.deferReply({ ephemeral: true });

		const targetPoll = await Poll.findOne({ messageId: messageId });
		const targetMessage = await interaction.channel?.messages.fetch(
			targetPoll?.messageId as string
		);
		const targetMessageEmbed = targetMessage?.embeds[0];

		if (targetPoll && targetMessageEmbed && action === "end") {
			if (interaction.user.id !== targetPoll.authorId) {
				interaction.editReply("You do not have permission to end this poll.");
				return;
			}
			let embedColor: ColorResolvable;
			if (targetPoll.upvotes.length > targetPoll.downvotes.length) {
				targetPoll.status = "pass";
				embedColor = "Green";
			} else if (targetPoll.upvotes.length < targetPoll.downvotes.length) {
				targetPoll.status = "fail";
				embedColor = "Red";
			} else targetPoll.status = "tie";
			{
				embedColor = "Yellow";
			}

			const newEmbed = EmbedBuilder.from(targetMessageEmbed)
				.setColor(embedColor)
				.toJSON();

			if (newEmbed && newEmbed.fields) {
				if (targetPoll.status === "pass") newEmbed.fields[1].value = "✅ Pass";
				if (targetPoll.status === "fail") newEmbed.fields[1].value = "⛔ Fail";
				if (targetPoll.status === "tie") newEmbed.fields[1].value = "⚖️ Tie";
			}

			await targetPoll.save();
			interaction.channel?.send(
				`${interaction.user}'s poll has concluded! Thanks for voting!`
			);
			interaction.editReply("Thanks for ending the poll!");
			targetMessage.edit({ embeds: [newEmbed], components: [] });
			return;
		}

		if (targetPoll && targetMessageEmbed && action === "upvote") {
			if (targetPoll.status !== "pending") {
				interaction.editReply(
					"Voting has concluded, this vote will not be counted!"
				);
				return;
			}
			const hasVoted =
				targetPoll.upvotes.includes(interaction.user.id) ||
				targetPoll.downvotes.includes(interaction.user.id);

			if (hasVoted) {
				interaction.editReply("You have already voted!");
				return;
			}
			targetPoll.upvotes.push(interaction.user.id);
			await targetPoll.save();
			interaction.editReply("Upvoted!");
			targetMessageEmbed.fields[2].value = formatResults(
				targetPoll.upvotes,
				targetPoll.downvotes
			);

			targetMessage.edit({
				embeds: [targetMessageEmbed],
			});
			return;
		}

		if (targetPoll && targetMessageEmbed && action === "downvote") {
			if (targetPoll.status !== "pending") {
				interaction.editReply(
					"Voting has concluded, this vote will not be counted!"
				);
				return;
			}
			const hasVoted =
				targetPoll.upvotes.includes(interaction.user.id) ||
				targetPoll.downvotes.includes(interaction.user.id);

			if (hasVoted) {
				interaction.editReply("You have already voted!");
				return;
			}
			targetPoll.downvotes.push(interaction.user.id);
			await targetPoll.save();
			interaction.editReply("Downvoted!");
			targetMessageEmbed.fields[2].value = formatResults(
				targetPoll.upvotes,
				targetPoll.downvotes
			);

			targetMessage.edit({
				embeds: [targetMessageEmbed],
			});
			return;
		}
	} catch (error) {
		console.error(error);
	}
};
