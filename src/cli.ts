import { parseArgs } from "node:util";

import { runOctoGuideRules } from "./index.js";
import { cliReporter } from "./reporters/cliReporter.js";
import { isKnownConfig } from "./rules/configs.js";

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

	const [url] = positionals;
	const { config } = values;
	if (config !== undefined && !isKnownConfig(config)) {
		throw new Error(`Unknown config provided: ${config}`);
	}

	const { reports } = await runOctoGuideRules({ config, entity: url });

	console.log(cliReporter(reports));
}
