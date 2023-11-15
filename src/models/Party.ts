import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
	{
		authorId: { type: String, required: true },
		guildId: { type: String, required: true },
		messageId: { type: String, required: true, unique: true },
		status: { type: String, default: "open" },
		joined: { type: [String], default: [] },
		partySize: { type: Number, default: 0 },
	},
	{ collection: "Parties" }
);

export const Party = mongoose.model("Party", partySchema);
