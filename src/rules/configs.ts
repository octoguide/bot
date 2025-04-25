import type { ConfigName } from "../types/configs.js";
import type { Rule } from "../types/rules.js";

import { rules } from "./all.js";

export const configs = {
	recommended: rules.filter((rule) => rule.about.config === "recommended"),
	strict: rules.filter((rule) =>
		["recommended", "strict"].includes(rule.about.config),
	),
} satisfies Record<ConfigName, Rule[]>;

export function isKnownConfig(config: string): config is ConfigName {
	return Object.hasOwn(configs, config);
}
