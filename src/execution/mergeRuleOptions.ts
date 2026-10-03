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

	return {
		...merged,
		"include-associations": includeAssociations
			? new Set(["NONE", ...includeAssociations])
			: undefined,
		"include-bots": merged["include-bots"] ?? true,
	};
}
