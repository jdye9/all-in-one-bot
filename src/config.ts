import dotenv from "dotenv";
dotenv.config();

const { DISCORD_TOKEN, DISCORD_GUILD_ID, DISCORD_CLIENT_ID, DATABASE_URL } =
	process.env;

if (
	!DISCORD_TOKEN ||
	!DISCORD_GUILD_ID ||
	!DISCORD_CLIENT_ID ||
	!DATABASE_URL
) {
	throw new Error("Missing environment variables");
}

export const config = {
	DISCORD_TOKEN,
	DISCORD_GUILD_ID,
	DISCORD_CLIENT_ID,
	DATABASE_URL,
};
