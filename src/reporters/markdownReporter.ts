import type { RuleReport } from "../types/reports.js";

import { groupBy } from "../action/groupBy.js";
import { RESOLVED_BY_OCTOGUIDE } from "../constants.js";
import { formatReportAsMarkdown } from "./formatReportAsMarkdown.js";

/**
 * Message displayed when all reports are resolved.
 * @internal
 */
export const markdownReportPassMessage = `All reports are resolved now. Thanks! ✅\n\n${RESOLVED_BY_OCTOGUIDE}`;

/**
 * Formats a rule report as used by the GitHub Actions Workflow.
 *
 * If reports is empty, it will return a happy message.
 * Otherwise it will pretty-print the reports, grouped by rule.
 * @param headline Headline text for the report (typically entity information)
 * @param reports Rule reports as returned by `runOctoGuideRules`
 * @returns Formatted markdown string for GitHub comment
 * @example
 * import { markdownReporter, runOctoGuideRules } from "octoguide";
 *
 * const { entity, reports } = await runOctoGuideRules({
 *   entity: "https://github.com/OctoGuide/bot/issues/19",
 * });
 *
 * console.log(markdownReporter(entity.data.html_url, reports));
 */
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
