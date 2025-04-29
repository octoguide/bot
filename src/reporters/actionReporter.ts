import type * as core from "@actions/core";

import { marked } from "marked";

import type { RuleReport } from "../types/reports.js";

import { groupBy } from "../action/groupBy.js";

export async function actionReporter(
	headline: string,
	reports: RuleReport[],
	summary: typeof core.summary,
) {
	const byRule = groupBy(reports, (report) => report.about.name);

	summary.addHeading("OctoGuide Report", 1);
	summary.addRaw(headline + "\n\n");

	for (const ruleReports of Object.values(byRule)) {
		const { about } = ruleReports[0];

		summary.addHeading(`<a href="${about.url}">${about.name}</a>`, 2);
		summary.addRaw(await marked.parse(about.explanation.join(" ")));

		for (const report of ruleReports) {
			summary.addRaw(await marked.parse(report.data.primary));

			if (report.data.secondary) {
				summary.addRaw(await marked.parse(report.data.secondary.join(" ")));
			}

			summary.addRaw(await marked.parse(report.data.suggestion.join("\n")));
		}
	}

	summary.addSeparator();
	summary.addRaw(
		`🗺️ <em>This message was posted automatically by <a href="https://github.com/JoshuaKGoldberg/OctoGuide">OctoGuide</a>: a bot for GitHub repository best practices.</em>`,
	);
}
