import type {
	Rule,
	RuleAboutWithUrl,
	RuleOptions,
	RuleOptionsRaw,
} from "../types/rules.js";
import type { Settings } from "../types/settings.js";

import { allRules } from "../rules/all.js";
import { configs } from "../rules/configs.js";
import { mergeRuleOptions } from "./mergeRuleOptions.js";

export interface RuleAndOptions {
	options: RuleOptions;
	rule: Rule<RuleAboutWithUrl>;
}

export function resolveRules(settings: Settings = {}): RuleAndOptions[] {
	const configRuleNames = new Set(
		configs[settings.config ?? "recommended"].map((rule) => rule.about.name),
	);
	const overrides: Record<string, boolean | RuleOptionsRaw | undefined> =
		settings.rules ?? {};

	return allRules
		.filter((rule) => {
			const override = overrides[rule.about.name];

			return override === undefined
				? configRuleNames.has(rule.about.name)
				: !!override;
		})
		.map((rule) => ({
			options: mergeRuleOptions(
				settings.options,
				rule.about.defaultOptions,
				asRuleOptions(overrides[rule.about.name]),
			),
			rule,
		}));
}

function asRuleOptions(override: boolean | RuleOptionsRaw | undefined) {
	return typeof override === "object" ? override : undefined;
}
