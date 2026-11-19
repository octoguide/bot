import type { RuleOptions } from "../types/rules.ts";

import { isUserFromAI } from "./isUserFromAI.ts";

export function isRuleSkippedForUser(
	user: { login: string; type?: string },
	options: RuleOptions,
) {
	if (isUserFromAI(user)) {
		return !options["include-ais"];
	}

	return !options["include-bots"] && user.type === "Bot";
}
