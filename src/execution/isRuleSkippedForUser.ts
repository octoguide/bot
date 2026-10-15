import type { RuleOptions } from "../types/rules.ts";

export function isRuleSkippedForUser(
	user: { login: string; type?: string },
	options: RuleOptions,
) {
	return !options["include-bots"] && user.type === "Bot";
}
