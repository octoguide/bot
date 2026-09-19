import type { ConfigName } from "./core.js";
import type { RuleOptionsRaw } from "./rules.js";

export interface Settings {
	comments?: Comments;
	config?: ConfigName;
	options?: RuleOptionsRaw;
	rules?: Record<string, boolean | RuleOptionsRaw>;
}

interface Comments {
	footer: string;
	header: string;
}
