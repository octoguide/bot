import { runOctoGuide } from "./index.js";
import { cliReporter } from "./reporters/cli.js";

export async function cli(url: string) {
	if (!url) {
		throw new Error(
			"Please provide a url, like 'npx octoguide github.com/...'",
		);
	}

	console.log(`Checking ${url}...`);

	const { reports } = await runOctoGuide({ url });

	cliReporter(reports);
}
