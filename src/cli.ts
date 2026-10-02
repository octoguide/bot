import { parseArgs } from "node:util";

import { cliReporter } from "./reporters/cliReporter.ts";
import { resolveEntityUrl } from "./resolveEntityUrl.ts";
import { isKnownConfig } from "./rules/configs.ts";
import { runOctoGuideRules } from "./runOctoGuideRules.ts";

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

	const { reports } = await runOctoGuideRules({
		entity: await resolveEntityUrl(entity),
		settings: { config },
	});

	return cliReporter(reports);
}
