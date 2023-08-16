const mongoose = require("mongoose");

const guildConfigurationSchema = new mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, required: true },
	guildId: { type: String, required: true },
	pollChannelIds: { type: [String], default: [] },
});

const GuildConfiguration = mongoose.model(
	"GuildConfiguration",
	guildConfigurationSchema
);
module.exports = { GuildConfiguration };
