import { createCli } from "parse-standard-args";
import { z } from "zod";

import type { ConfigName } from "./types/core.js";

import { cliReporter } from "./reporters/cliReporter.js";
import { resolveEntityUrl } from "./resolveEntityUrl.js";
import { configs } from "./rules/configs.js";
import { runOctoGuideRules } from "./runOctoGuideRules.js";

const configNames = Object.keys(configs) as [ConfigName, ...ConfigName[]];

export const octoguideCli = createCli({
	description:
		"Previews the reports OctoGuide would post for a GitHub contribution.",
	examples: [
		"npx octoguide https://github.com/OctoGuide/bot/issues/19",
		"npx octoguide OctoGuide/bot/issues/19 --config strict",
	],
	footer: "Docs: https://octo.guide/cli",
	name: "octoguide",
	options: z.object({
		config: z
			.enum(configNames, {
				error: (issue) =>
					`Unknown config provided: '${String(issue.input)}' (expected one of: ${configNames.join(", ")}).`,
			})
			.optional()
			.describe("Which preset config to use")
			.meta({ defaultDescription: "recommended" }),
	}),
	positionals: z
		.array(z.string())
		.min(1, "Please provide a url, like 'npx octoguide github.com/...'")
		.meta({ placeholder: "url" }),
	positionalsUsage: "<url>",
});

/**
 * Runs the OctoGuide CLI on command-line args.
 * Help text and input errors are printed directly, with errors also setting
 * `process.exitCode` to 1.
 * @param args Command-line args, such as `process.argv.slice(2)`.
 * @returns Pretty-printed reports for the entity, or undefined if it wasn't run.
 */
export async function cli(...args: string[]) {
	const parsed = await octoguideCli.run(args);
	if (!parsed) {
		return undefined;
	}

	const [entity] = parsed.positionals;
	const { config } = parsed.values;

	const { reports } = await runOctoGuideRules({
		entity: await resolveEntityUrl(entity),
		settings: { config },
	});

	return cliReporter(reports);
}
