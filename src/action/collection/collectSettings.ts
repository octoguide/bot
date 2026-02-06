import * as core from "@actions/core";

import { mergeRuleOptions } from "../../execution/mergeRuleOptions.js";
import { allRules } from "../../rules/all.js";
import { isKnownConfig } from "../../rules/configs.js";
import { RuleOptionsRaw } from "../../types/rules.js";
import { parseIncludeAssociations } from "./parseIncludeAssociations.js";
import { parseRuleOptions } from "./parseRuleOptions.js";

export function collectSettings() {
	const config = core.getInput("config") || "recommended";
	if (!isKnownConfig(config)) {
		throw new Error(`Unknown config provided: ${config}`);
	}

	const ruleOptions = parseRuleOptions(core.getInput("rules"));
	if (ruleOptions instanceof Error) {
		throw new Error(`Could not parse "rules" input:`, { cause: ruleOptions });
	}

	const baseOptions = {
		includeAssociations: parseIncludeAssociations(
			core.getInput("include-associations"),
		),
		includeBots: core.getInput("include-bots") === "true",
	};

	const rules = Object.fromEntries(
		allRules.map((rule) => {
			const ruleOptionOverrides = ruleOptions[rule.about.name] as
				| false
				| null
				| RuleOptionsRaw
				| undefined;

			return [
				rule.about.name,
				{
					options: mergeRuleOptions(baseOptions, {
						...rule.about.defaultOptions,
						...(ruleOptionOverrides ?? {}),
					}),
					rule,
				},
			];
		}),
	);

	return {
		comments: {
			footer:
				core.getInput("comment-footer") ||
				"🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices.",
			header: core.getInput("comment-header"),
		},
		config,
		rules,
	};
}
