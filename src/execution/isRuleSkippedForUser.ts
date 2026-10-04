import type { RuleOptions } from "../types/rules.js";

export function isRuleSkippedForUser(
	user: { login: string; type?: string },
	options: RuleOptions,
) {
	return !options["include-bots"] && user.type === "Bot";
}
