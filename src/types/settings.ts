import type { ConfigName } from "./core.js";
import type { RuleOptionsRaw } from "./rules.js";

export interface Settings {
	comments?: Comments;
	config?: ConfigName;
	options?: SettingsOptions;
	rules?: Record<string, boolean | RuleOptionsRaw>;
}

interface Comments {
	footer: string;
	header: string;
}

/**
 * Options for every rule, as provided in user settings.
 */
export interface SettingsOptions extends RuleOptionsRaw {
	/**
	 * Whether rules run on entities created by known AI agents.
	 * If not provided, each rule's resolved `include-bots` applies to AI agents.
	 * This is only a top-level option, not a per-rule one.
	 */
	"include-ais"?: boolean;
}
