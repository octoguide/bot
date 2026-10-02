import type { RuleOptions, RuleOptionsRaw } from "../types/rules.js";

export function mergeRuleOptions(
	...layers: (RuleOptionsRaw | undefined)[]
): RuleOptions {
	const merged: RuleOptionsRaw = {};

	for (const layer of layers) {
		for (const [key, value] of Object.entries(layer ?? {})) {
			if (value !== undefined) {
				merged[key] = value;
			}
		}
	}

	const includeAssociations = merged["include-associations"];
	const includeBots = merged["include-bots"] ?? true;

	return {
		...merged,
		"include-ais": merged["include-ais"] ?? includeBots,
		"include-associations": includeAssociations
			? new Set(["NONE", ...includeAssociations])
			: undefined,
		"include-bots": includeBots,
	};
}
