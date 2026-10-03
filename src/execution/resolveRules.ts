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
	const { "include-ais": includeAIs, ...options } = settings.options ?? {};
	const overrides: Record<string, boolean | RuleOptionsRaw | undefined> =
		settings.rules ?? {};

	return allRules
		.filter((rule) => {
			const override = overrides[rule.about.name];

			return override === undefined
				? configRuleNames.has(rule.about.name)
				: !!override;
		})
		.map((rule) => {
			const merged = mergeRuleOptions(
				options,
				rule.about.defaultOptions,
				asRuleOptions(rule.about.name, overrides[rule.about.name]),
			);

			return {
				options: {
					...merged,
					"include-ais": includeAIs ?? merged["include-bots"],
				},
				rule,
			};
		});
}

function asRuleOptions(
	ruleName: string,
	override: boolean | RuleOptionsRaw | undefined,
) {
	if (typeof override !== "object") {
		return undefined;
	}

	if (override["include-ais"] !== undefined) {
		throw new Error(
			`"include-ais" can only be set as a top-level option, not in the "${ruleName}" rule's options.`,
		);
	}

	return override;
}
