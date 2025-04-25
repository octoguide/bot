import type { RuleReport } from "../types/rules.js";

import { formatSecondary } from "./formatSecondary.js";

export function formatReport(report: RuleReport) {
	const secondaryLines = formatSecondary(report.data.secondary);

	return [
		report.data.primary,
		"<!--A-->",
		secondaryLines.length > 0
			? /^\w/.test(secondaryLines[0])
				? " "
				: "\n\n"
			: "",
		"<!--B-->",
		secondaryLines.join("\n"),
		"<!--C-->",
		/^\w/.test(secondaryLines[secondaryLines.length - 1]) ? " " : "\n\n",
		"<!--D-->",
		report.data.suggestion.join("\n"),
	].join("");
}
