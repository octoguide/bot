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
		.map((rule) => {
			const override = asRuleOptions(overrides[rule.about.name]);

			return {
				options: mergeRuleOptions(
					settings.options,
					getDefaultOptions(rule, override),
					override,
				),
				rule,
			};
		});
}

function asRuleOptions(override: boolean | RuleOptionsRaw | undefined) {
	return typeof override === "object" ? override : undefined;
}

/**
 * Gets a rule's default options, without its default `include-ais` if the
 * user's options for the rule set `include-bots` but not `include-ais`.
 * @remarks This way, a user's `include-bots` for a rule still applies to AI
 * agents, rather than being overridden by the rule's own defaults.
 */
function getDefaultOptions(
	rule: Rule<RuleAboutWithUrl>,
	override: RuleOptionsRaw | undefined,
) {
	return override?.["include-bots"] !== undefined &&
		override["include-ais"] === undefined
		? { ...rule.about.defaultOptions, "include-ais": undefined }
		: rule.about.defaultOptions;
}
