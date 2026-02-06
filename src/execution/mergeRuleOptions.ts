import { defaultIncludeAssociations } from "../action/collection/parseIncludeAssociations";
import { RuleOptions, RuleOptionsRaw } from "../types/rules";

export interface BaseOptions {
	includeAssociations?: Set<string>;
	includeBots?: boolean;
}

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
