import { ChannelType, Client } from "discord.js";
import { GuildConfiguration } from "../models";

export default (client: Client): void => {
	client.on("guildMemberAdd", async (member) => {
		let guildConfiguration = await GuildConfiguration.findOne({
			guildId: member.guild.id,
		});
		if (!guildConfiguration) {
			guildConfiguration = new GuildConfiguration({
				guildId: member.guild.id,
			});
		}
		const welcomeRoles = guildConfiguration.welcomeRoleIds;

		welcomeRoles.forEach(async (role) => await member.roles.add(role));

		const welcomeChannels = guildConfiguration.welcomeChannelIds;

		welcomeChannels.forEach(async (channelId) => {
			const channel = await member.guild.channels.fetch(channelId);
			if (channel && channel.type === ChannelType.GuildText)
				channel.send(`Welcome to the server, ${member.user}!`);
		});
	});
};
