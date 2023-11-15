export const formatResults = (upvotes: string[], downvotes: string[]) => {
	const totalVotes = upvotes.length + downvotes.length;
	const progressBarLength = 10;
	const yesSquares =
		Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
	const noSquares =
		Math.round((downvotes.length / totalVotes) * progressBarLength) || 0;

	const emptySquares = progressBarLength - (yesSquares + noSquares) || 0;

	const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
	const downPercentage = (downvotes.length / totalVotes) * 100 || 0;

	const progressBar =
		"🟩".repeat(yesSquares) +
		"🟥".repeat(noSquares) +
		"⬜️".repeat(emptySquares);

	const results = [];
	results.push(
		`⬆️ ${upvotes.length} For (${upPercentage.toFixed(1)}%) • ⬇️ ${
			downvotes.length
		} Against (${downPercentage.toFixed(1)}%)`
	);
	results.push(progressBar);
	return results.join("\n\n");
};

export const formatResultsParty = (joined: string[], partySize: number) => {
	const yesSquares = joined.length;
	const openSquares = Math.round(partySize - joined.length);

	const progressBar = "🟩".repeat(yesSquares) + "⬜️".repeat(openSquares);

	const results = [];
	results.push(
		joined.length === partySize
			? `${joined.length} • Party Full`
			: `${joined.length} Joined • ${partySize - joined.length} Opening${
					partySize - joined.length === 1 ? "" : "s"
			  }`
	);
	results.push(progressBar);
	return results.join("\n\n");
};
