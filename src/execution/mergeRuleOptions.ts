import { defaultIncludeAssociations } from "../action/collection/parseIncludeAssociations";
import { RuleOptions, RuleOptionsRaw } from "../types/rules";
import { BaseOptions } from "../types/settings";

export function mergeRuleOptions(
	baseOptions: BaseOptions = {},
	ruleOptions: boolean | null | RuleOptionsRaw | undefined,
): RuleOptions {
	if (!ruleOptions || typeof ruleOptions === "boolean") {
		ruleOptions = {};
	}

	return {
		...baseOptions,
		...ruleOptions,
		"include-associations": ruleOptions["include-associations"]
			? new Set(ruleOptions["include-associations"])
			: (baseOptions.includeAssociations ?? defaultIncludeAssociations),
		"include-bots": ruleOptions["include-bots"] ?? baseOptions.includeBots,
	};
}
