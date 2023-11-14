import { ChannelType, Client } from "discord.js";

export default (client: Client): void => {
	client.on("guildMemberAdd", async (member) => {
		const welcomeRole = await member.guild.roles.fetch("1140764480893112362");
		if (!!welcomeRole) await member.roles.add(welcomeRole);
		const welcomeChannel = await member.guild.channels.fetch(
			"1140764795478478878"
		);
		if (welcomeChannel && welcomeChannel.type === ChannelType.GuildText)
			welcomeChannel.send(`Welcome to the server, ${member.user}!`);
	});
};
