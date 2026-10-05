import type { ConfigName } from "./core.ts";
import type { RuleOptionsRaw } from "./rules.ts";

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
