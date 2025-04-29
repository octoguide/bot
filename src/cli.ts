import { parseArgs } from "node:util";

import { cliReporter } from "./reporters/cliReporter.js";
import { isKnownConfig } from "./rules/configs.js";
import { runOctoGuideRules } from "./runOctoGuideRules.js";

export async function cli(...args: string[]) {
	const { positionals, values } = parseArgs({
		allowPositionals: true,
		args,
		options: {
			config: {
				type: "string",
			},
		},
	});
	if (!positionals.length) {
		throw new Error(
			"Please provide a url, like 'npx octoguide github.com/...'",
		);
	}

	const [entity] = positionals;
	const { config } = values;
	if (config !== undefined && !isKnownConfig(config)) {
		throw new Error(`Unknown config provided: '${config}'`);
	}

	const { reports } = await runOctoGuideRules({ config, entity });

	return cliReporter(reports);
}
