import type { RuleAbout } from "./rules.ts";

export type ConfigName = "none" | "recommended" | "strict";

/**
 * Metadata for a core OctoGuide rule.
 */
export interface CoreRuleMetadata extends RuleAbout {
	/**
	 * Which preset config starts including the rule.
	 */
	config: ConfigName;
}
