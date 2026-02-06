import type { ConfigName } from "./core.js";
import type { RuleOptionsRaw } from "./rules.js";

export interface BaseOptions {
	includeAssociations?: Set<string>;
	includeBots?: boolean;
}

export interface Comments {
	footer: string;
	header: string;
}

export interface Settings {
	baseOptions: BaseOptions;
	comments?: Comments;
	config?: ConfigName;
	rules?: Record<string, boolean | RuleOptionsRaw>;
}
