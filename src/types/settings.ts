import type { ConfigName } from "./core.js";
import type { RuleOptionsRaw } from "./rules.js";

export interface Comments {
	footer: string;
	header: string;
}

export interface Settings {
	comments?: Comments;
	config?: ConfigName;
	rules?: Record<string, boolean | RuleOptionsRaw>;
}
