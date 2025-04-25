import type { RuleReport } from "../types/rules.js";

import { formatSecondary } from "./formatSecondary.js";

export function formatReport(report: RuleReport, explanation?: string[]) {
	const secondaryLines = formatSecondary(report.data.secondary);

	return [
		report.data.primary,
		secondaryLines.length > 0
			? /^\w/.test(secondaryLines[0])
				? " "
				: "\n\n"
			: "",
		secondaryLines.join("\n"),
		/^\w/.test(secondaryLines[secondaryLines.length - 1]) ? " " : "\n\n",
		explanation ? explanation.join(" ") : "",
		report.data.suggestion.join("\n"),
	].join("");
}
