import chalk from "chalk";

import type { RuleReport } from "../types/rules.js";

export function cliReporter(reports: RuleReport[]) {
	if (!reports.length) {
		console.log(
			`Found ${chalk.green(reports.length)} issue${reports.length > 1 ? "s" : ""}. Great! ✅`,
		);
	}

	console.log("");

	const byRule = Object.groupBy(reports, (report) => report.about.name);

	for (const ruleReports of Object.values(byRule)) {
		if (!ruleReports) {
			continue;
		}

		const { about } = ruleReports[0];
		console.log(
			[
				chalk.blue("["),
				chalk.cyanBright(about.name),
				chalk.blue("] "),
				chalk.yellow(about.description),
			].join(""),
		);

		for (const report of ruleReports) {
			console.log(
				[
					report.data.primary,
					...(report.data.secondary?.map((line) => `  ${line}`) ?? []),
				].join("\n"),
			);
			console.log(
				chalk.gray(
					`Docs: https://github.com/JoshuaKGoldberg/octoguide/blob/main/docs/rules/${report.about.name}.md`,
				),
			);
			console.log("");
		}
	}

	console.log(
		`Found ${chalk.red(reports.length)} issue${reports.length > 1 ? "s" : ""}.\n`,
	);
}
