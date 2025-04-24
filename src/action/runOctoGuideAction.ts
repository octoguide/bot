import * as core from "@actions/core";
import * as github from "@actions/github";

import { runOctoGuide } from "../index.js";
import { cliReporter } from "../reporters/cli.js";

// TODO :)

export async function runOctoGuideAction(context: typeof github.context) {
	const { payload } = context;

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const entity = (payload.comment ?? payload.issue ?? payload.pull_request)!;

	console.log({ entity });

	const reports = await runOctoGuide({
		githubToken: core.getInput("github-token"),
		url: entity.html_url as string,
	});

	cliReporter(reports);

	for (const report of reports) {
		core.error(
			[
				report.data.primary,
				...(report.data.secondary?.map((line) => `  ${line}`) ?? []),
			].join("\n"),
		);
	}
}
