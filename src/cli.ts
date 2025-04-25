import { runOctoGuide } from "./index.js";
import { cliReporter } from "./reporters/cliReporter.js";

export async function cli(url: string) {
	if (!url) {
		throw new Error(
			"Please provide a url, like 'npx octoguide github.com/...'",
		);
	}

	const { reports } = await runOctoGuide({ url });

	console.log(cliReporter(reports));
}
