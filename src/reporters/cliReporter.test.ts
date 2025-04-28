import { describe, expect, test } from "vitest";

import type { RuleReportData } from "../types/reports.js";
import type { RuleAbout } from "../types/rules.js";

import { cliReporter } from "./cliReporter.js";

const fakeAbout = {
	description: "Fake description.",
	explanation: ["Fake explanation."],
	name: "fake-rule",
} satisfies RuleAbout;

const fakeData = {
	primary: "Fake primary.",
	suggestion: ["Fake suggestion."],
} satisfies RuleReportData;

describe(cliReporter, () => {
	test("no reports", () => {
		expect(cliReporter([])).toMatchInlineSnapshot(
			`"Found 0 reports. Great! ✅"`,
		);
	});

	test("one report", () => {
		expect(
			cliReporter([
				{
					about: fakeAbout,
					data: fakeData,
				},
			]),
		).toMatchInlineSnapshot(`
			"
			[fake-rule] Fake description.
			Fake primary. Fake explanation. Fake suggestion.

			Found 1 issue.
			"
		`);
	});

	test("two reports in one group", () => {
		expect(
			cliReporter([
				{
					about: fakeAbout,
					data: fakeData,
				},
				{
					about: fakeAbout,
					data: fakeData,
				},
			]),
		).toMatchInlineSnapshot(`
			"
			[fake-rule] Fake description.
			Fake explanation.

			Fake primary. Fake suggestion.

			Fake primary. Fake suggestion.

			Found 2 issues.
			"
		`);
	});

	test("two reports across two group", () => {
		expect(
			cliReporter([
				{
					about: {
						...fakeAbout,
						name: "first",
					},
					data: fakeData,
				},
				{
					about: {
						...fakeAbout,
						name: "second",
					},
					data: fakeData,
				},
			]),
		).toMatchInlineSnapshot(`
			"
			[first] Fake description.
			Fake primary. Fake explanation. Fake suggestion.

			[second] Fake description.
			Fake primary. Fake explanation. Fake suggestion.

			Found 2 issues.
			"
		`);
	});

	test("four reports across two group", () => {
		expect(
			cliReporter([
				{
					about: {
						...fakeAbout,
						name: "first",
					},
					data: fakeData,
				},
				{
					about: {
						...fakeAbout,
						name: "second",
					},
					data: fakeData,
				},
				{
					about: {
						...fakeAbout,
						name: "first",
					},
					data: fakeData,
				},
				{
					about: {
						...fakeAbout,
						name: "second",
					},
					data: fakeData,
				},
			]),
		).toMatchInlineSnapshot(`
			"
			[first] Fake description.
			Fake explanation.

			Fake primary. Fake suggestion.

			Fake primary. Fake suggestion.

			[second] Fake description.
			Fake explanation.

			Fake primary. Fake suggestion.

			Fake primary. Fake suggestion.

			Found 4 issues.
			"
		`);
	});
});
