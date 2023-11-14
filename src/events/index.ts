import * as ready from "./ready";
import * as interactionCreate from "./interactionCreate/interactionCreate";
import * as guildMemberAdd from "./guildMemberAdd";
import * as guildAvailable from "./guildAvailable";
import * as guildCreate from "./guildCreate";

export const events = [
	ready,
	interactionCreate,
	guildMemberAdd,
	guildAvailable,
	guildCreate,
];
