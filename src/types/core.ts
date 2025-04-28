import type { RuleAbout } from "./rules.js";

export type ConfigName = "recommended" | "strict";

/**
 * Metadata for a core OctoGuide rule.
 */
export interface CoreRuleAbout extends RuleAbout {
	/**
	 * Which preset config starts including the rule.
	 */
	config: ConfigName;
}
