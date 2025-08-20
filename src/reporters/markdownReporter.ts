import type { RuleReport } from "../types/reports.js";

import { groupBy } from "../action/groupBy.js";
import { RESOLVED_BY_OCTOGUIDE } from "../constants.js";
import { formatReportAsMarkdown } from "./formatReportAsMarkdown.js";

export const markdownReportPassMessage = `All reports are resolved now. Thanks! ✅\n\n${RESOLVED_BY_OCTOGUIDE}`;

export function markdownReporter(headline: string, reports: RuleReport[]) {
	if (!reports.length) {
		return markdownReportPassMessage;
	}

	const byRule = groupBy(reports, (report) => report.about.name);

	const printedReports = Object.values(byRule).map((ruleReports) => {
		const { about } = ruleReports[0];
		const start = `[[**${about.name}**](${about.url})]`;

		if (ruleReports.length > 1) {
			return [
				start,
				" ",
				about.explanation.join(" "),
				"\n\n",
				ruleReports
					.map((report) => formatReportAsMarkdown(report))
					.join("\n\n"),
			].join("");
		}

		return [
			start,
			" ",
			ruleReports
				.map((report) => formatReportAsMarkdown(report, about.explanation))
				.join("\n\n"),
		].join("");
	});

	return [headline, "\n\n", printedReports.join("\n\n")].join("");
}
