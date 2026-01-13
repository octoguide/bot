import { RuleOptions, RuleOptionsRaw } from "../types/rules";
import { BaseOptions } from "../types/settings";

export function mergeRuleOptions(
	baseOptions: BaseOptions,
	overrides: boolean | RuleOptionsRaw | undefined,
): RuleOptions {
	if (!overrides || typeof overrides === "boolean") {
		return {
			includeAssociations: baseOptions.includeAssociations,
			includeBots: baseOptions.includeBots,
		};
	}

	return {
		...baseOptions,
		...overrides,
		"include-associations": overrides["include-associations"]
			? new Set(overrides["include-associations"])
			: baseOptions.includeAssociations,
		"include-bots": overrides["include-bots"] ?? baseOptions.includeBots,
	};
}
