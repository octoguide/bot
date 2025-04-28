import chalk from "chalk";

import type { RuleReport } from "../types/reports.js";

import { groupBy } from "../action/groupBy.js";
import { formatReport } from "./formatReport.js";

export function cliReporter(reports: RuleReport[]) {
	if (!reports.length) {
		return `Found ${chalk.green("0")} reports. Great! ✅`;
	}

	const byRule = groupBy(reports, (report) => report.about.name);
	const lines: string[] = [""];

	for (const ruleReports of Object.values(byRule)) {
		const { about } = ruleReports[0];
		lines.push(
			[
				chalk.blue("["),
				chalk.cyanBright(about.name),
				chalk.blue("] "),
				chalk.yellow(about.description),
			].join(""),
		);

		if (ruleReports.length > 1) {
			lines.push(
				[
					about.explanation.join(" "),
					"\n\n",
					ruleReports.map((report) => formatReport(report)).join("\n\n"),
				].join(""),
			);
		} else {
			lines.push(
				[
					ruleReports
						.map((report) => formatReport(report, about.explanation))
						.join("\n\n"),
				].join(""),
			);
		}

		lines.push("");
	}

	lines.push(
		`Found ${chalk.red(reports.length)} issue${reports.length > 1 ? "s" : ""}.\n`,
	);

	return lines.join("\n");
}
