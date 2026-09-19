import * as core from "@actions/core";

import type { Settings } from "../../types/settings.js";

import { isKnownConfig } from "../../rules/configs.js";
import { parseIncludeAssociations } from "./parseIncludeAssociations.js";
import { parseRules } from "./parseRules.js";

export function collectSettings(): Settings {
	const config = core.getInput("config") || "recommended";
	if (!isKnownConfig(config)) {
		throw new Error(`Unknown config provided: ${config}`);
	}

	const rules = parseRules(core.getInput("rules"));
	if (rules instanceof Error) {
		throw new Error(`Could not parse "rules" input:`, { cause: rules });
	}

	return {
		comments: {
			footer:
				core.getInput("comment-footer") ||
				"🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices.",
			header: core.getInput("comment-header"),
		},
		config,
		options: {
			"include-associations": parseIncludeAssociations(
				core.getInput("include-associations"),
			),
			"include-bots": core.getInput("include-bots") === "true",
		},
		rules,
	};
}
