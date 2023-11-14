import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
	{
		authorId: { type: String, required: true },
		guildId: { type: String, required: true },
		messageId: { type: String, required: true, unique: true },
		status: { type: String, default: "pending" },
		upvotes: { type: [String], default: [] },
		downvotes: { type: [String], default: [] },
	},
	{ collection: "Polls" }
);

export const Poll = mongoose.model("Poll", pollSchema);
