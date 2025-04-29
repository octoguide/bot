import { describe, expect, test } from "vitest";

import type { RuleAboutWithUrl } from "../types/rules.js";

import { formatReportAsMarkdown } from "./formatReportAsMarkdown.js";

const about = {
	description: "My test rule.",
	explanation: ["First explanation sentence.", "Second sentence."],
	name: "test-rule",
	url: "example.com",
} satisfies RuleAboutWithUrl;

describe(formatReportAsMarkdown, () => {
	test("report without secondary", () => {
		const actual = formatReportAsMarkdown({
			about,
			data: {
				primary: "Primary line.",
				suggestion: ["Suggestion line"],
			},
		});

		expect(actual).toMatchInlineSnapshot(`"Primary line. Suggestion line"`);
	});

	test("report with sentence secondary", () => {
		const actual = formatReportAsMarkdown({
			about,
			data: {
				primary: "Primary line.",
				secondary: ["First secondary line.", "Second secondary line."],
				suggestion: ["Suggestion line"],
			},
		});

		expect(actual).toMatchInlineSnapshot(`
			"Primary line. First secondary line.
			Second secondary line. Suggestion line"
		`);
	});

	test("report with block quote secondary", () => {
		const actual = formatReportAsMarkdown({
			about,
			data: {
				primary: "Primary line.",
				secondary: ["First secondary line.", "```md", "[]()", "```"],
				suggestion: ["Suggestion line"],
			},
		});

		expect(actual).toMatchInlineSnapshot(`
			"Primary line. First secondary line.
			\`\`\`md
			[]()
			\`\`\`

			Suggestion line"
		`);
	});

	test("report with secondary and explanation", () => {
		const actual = formatReportAsMarkdown(
			{
				about,
				data: {
					primary: "Primary line.",
					secondary: ["First secondary line.", "Second secondary line."],
					suggestion: ["Suggestion line"],
				},
			},
			["First explanation line.", "Second explanation line."],
		);

		expect(actual).toMatchInlineSnapshot(`
			"Primary line. First secondary line.
			Second secondary line. First explanation line. Second explanation line. Suggestion line"
		`);
	});
});
