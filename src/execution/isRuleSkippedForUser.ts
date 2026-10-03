import type { RuleOptions } from "../types/rules.js";

/**
 * Checks whether a rule's options exclude a user based on their account type.
 * @remarks This applies to both entities' authors and other users who edit
 * them, so that bots are excluded the same way for each.
 */
export function isRuleSkippedForUser(
	user: { login: string; type?: string },
	options: RuleOptions,
) {
	return !options["include-bots"] && user.type === "Bot";
}
