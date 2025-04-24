import type { RuleReport } from "../types/rules.js";

import { groupBy } from "../action/groupBy.js";
import { formatSecondary } from "./formatSecondary.js";

export function markdownReporter(reports: RuleReport[]) {
	const byRule = groupBy(reports, (report) => report.about.name);

	return Object.values(byRule)
		.map((ruleReports) => {
			const { about } = ruleReports[0];
			return [
				`[${about.name}](https://github.com/JoshuaKGoldberg/octoguide/blob/main/docs/rules/${about.name}.md)`,
				about.description,
				ruleReports
					.map((report) => [
						report.data.primary,
						...formatSecondary(report.data.secondary),
					])
					.join("\n"),
			].join("\n");
		})
		.join("\n\n");
}
