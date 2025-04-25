import type { RuleReport } from "../types/rules.js";

import { formatSecondary } from "./formatSecondary.js";

export function formatReport(report: RuleReport) {
	const secondaryLines = formatSecondary(report.data.secondary);

	return [
		report.data.primary,
		" ",
		secondaryLines.join("\n"),
		/^\w+/.test(secondaryLines[secondaryLines.length - 1]) ? " " : "\n",
		report.data.suggestion.join("\n"),
	].join("");
}
