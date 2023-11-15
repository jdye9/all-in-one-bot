import { ButtonInteraction, ColorResolvable, EmbedBuilder } from "discord.js";
import { formatResultsParty } from "../../utils";
import { Party } from "../../models/Party";
import { client } from "../../index";

export const handleParty = async (interaction: ButtonInteraction) => {
	if (!interaction.isButton() || !interaction.customId) return;
	try {
		const [type, messageId, action] = interaction.customId.split("-");
		if (!type || !messageId || !action) return;
		if (type !== "party") return;
		await interaction.deferReply({ ephemeral: true });

		const targetParty = await Party.findOne({ messageId: messageId });
		const targetMessage = await interaction.channel?.messages.fetch(
			targetParty?.messageId as string
		);
		const targetMessageEmbed = targetMessage?.embeds[0];

		if (targetParty && targetMessageEmbed && action === "join") {
			if (targetParty.status !== "open") {
				interaction.editReply("Party is no longer accepting members, sorry!");
				return;
			}
			const hasJoined = targetParty.joined.includes(interaction.user.id);

			if (hasJoined) {
				interaction.editReply("You have already joined the party!");
				return;
			}
			targetParty.joined.push(interaction.user.id);

			const embedColor: ColorResolvable =
				targetParty.joined.length === targetParty.partySize ? "Green" : "Grey";

			if (targetParty.joined.length === targetParty.partySize) {
				targetParty.status = "full";
			}

			await targetParty.save();
			interaction.editReply("Joined the party!");

			const joinedTags = await Promise.all(
				targetParty.joined.map(
					async (user) => (await client.users.fetch(user)).tag
				)
			);
			targetMessageEmbed.fields[2].value = joinedTags.join("\n");

			targetMessageEmbed.fields[3].value = formatResultsParty(
				targetParty.joined,
				targetParty.partySize
			);

			const newEmbed = EmbedBuilder.from(targetMessageEmbed)
				.setColor(embedColor)
				.toJSON();

			targetMessage.edit({
				embeds: [newEmbed],
			});
			return;
		}

		if (targetParty && targetMessageEmbed && action === "leave") {
			const hasJoined = targetParty.joined.includes(interaction.user.id);

			if (!hasJoined) {
				interaction.editReply("You haven't joined this party!");
				return;
			}
			const newParty = targetParty.joined.filter(
				(member) => member !== interaction.user.id
			);
			targetParty.joined = newParty;

			const embedColor: ColorResolvable =
				targetParty.joined.length === targetParty.partySize ? "Green" : "Grey";

			if (targetParty.joined.length !== targetParty.partySize) {
				targetParty.status = "open";
			}

			await targetParty.save();
			interaction.editReply("You have left the party!");

			const joinedTags = await Promise.all(
				targetParty.joined.map(
					async (user) => (await client.users.fetch(user)).tag
				)
			);
			targetMessageEmbed.fields[2].value = joinedTags.join("\n");

			targetMessageEmbed.fields[3].value = formatResultsParty(
				targetParty.joined,
				targetParty.partySize
			);

			const newEmbed = EmbedBuilder.from(targetMessageEmbed)
				.setColor(embedColor)
				.toJSON();

			targetMessage.edit({
				embeds: [newEmbed],
			});
			return;
		}
	} catch (error) {
		console.error(error);
	}
};
