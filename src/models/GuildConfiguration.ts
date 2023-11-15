import mongoose from "mongoose";

const guildConfigurationSchema = new mongoose.Schema(
	{
		guildId: { type: String, required: true, unique: true },
		pollChannelIds: { type: [String], default: [] },
		welcomeChannelIds: { type: [String], default: [] },
		welcomeRoleIds: { type: [String], default: [] },
	},
	{ collection: "GuildConfigurations" }
);

export const GuildConfiguration = mongoose.model(
	"GuildConfiguration",
	guildConfigurationSchema
);
