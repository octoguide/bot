import type { ConfigName } from "../types/core.js";
import type { Rule } from "../types/rules.js";

import { allRules } from "./all.js";

export const configs = {
	none: [],
	recommended: allRules.filter((rule) => rule.about.config === "recommended"),
	strict: allRules.filter((rule) =>
		["recommended", "strict"].includes(rule.about.config),
	),
} satisfies Record<ConfigName, Rule[]>;

export function isKnownConfig(config: string): config is ConfigName {
	return Object.hasOwn(configs, config);
}
