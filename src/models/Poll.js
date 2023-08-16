const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		authorId: { type: String, required: true },
		guildId: { type: String, required: true },
		messageId: { type: String, required: true, unique: true },
		content: { type: String, required: true },
		status: { type: String, default: "pending" },
		upvotes: { type: String, default: [] },
		downvotes: { type: String, default: [] },
	},
	{ timestamps: true }
);

const Poll = mongoose.model("Poll", pollSchema);
module.exports = { Poll };
