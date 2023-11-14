import * as ping from "./ping";
import * as help from "./help";
import * as echo from "./echo";
import * as hello from "./hello";
import * as configPoll from "./config-poll";
import * as poll from "./poll";

export const commands = {
	ping: ping,
	help: help,
	echo: echo,
	hello: hello,
	"config-poll": configPoll,
	poll: poll,
};
