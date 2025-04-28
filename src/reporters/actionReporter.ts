import type * as core from "@actions/core";

import type { RuleReport } from "../types/reports.js";

import { groupBy } from "../action/groupBy.js";

export function actionReporter(
	headline: string,
	reports: RuleReport[],
	summary: typeof core.summary,
) {
	const byRule = groupBy(reports, (report) => report.about.name);

	summary.addHeading("OctoGuide Report", 1);
	summary.addRaw(headline);

	for (const ruleReports of Object.values(byRule)) {
		const { about } = ruleReports[0];

		summary.addHeading(`<a href="${about.url}">${about.name}</a>`, 2);
		summary.addRaw(about.description);
		summary.addBreak();
		summary.addRaw(about.explanation.join(" "));
		summary.addBreak();

		for (const report of ruleReports) {
			summary.addRaw(report.data.primary);

			if (report.data.secondary) {
				summary.addRaw(report.data.secondary.join(" "));
			}

			summary.addRaw(report.data.suggestion.join("\n"));
		}
	}

	summary.addSeparator();
	summary.addRaw(
		`🗺️ <em>This message was posted automatically by <a href="https://github.com/JoshuaKGoldberg/OctoGuide">OctoGuide</a>: a bot for GitHub repository best practices.</em>`,
	);
}
