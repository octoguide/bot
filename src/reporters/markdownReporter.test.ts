import { describe, expect, test } from "vitest";

import type { RuleReportData } from "../types/reports.js";
import type { RuleAboutWithUrl } from "../types/rules.js";

import { markdownReporter } from "./markdownReporter.js";

const fakeAbout = {
	description: "Fake description.",
	explanation: ["Fake explanation."],
	name: "fake-rule",
	url: "https://octo.guide/rules/fake-rule",
} satisfies RuleAboutWithUrl;

const fakeData = {
	primary: "Fake primary.",
	suggestion: ["Fake suggestion."],
} satisfies RuleReportData;

const heading = "Hi, thanks for the issue, etc.";

describe(markdownReporter, () => {
	test("no reports", () => {
		expect(markdownReporter(heading, [])).toMatchInlineSnapshot(
			`
			"All reports are resolved now. Thanks! ✅

			<!-- resolved-by: OctoGuide -->"
		`,
		);
	});

	test("one report", () => {
		expect(
			markdownReporter(heading, [
				{
					about: fakeAbout,
					data: fakeData,
				},
			]),
		).toMatchInlineSnapshot(
			`
			"Hi, thanks for the issue, etc.

			[[**fake-rule**](https://octo.guide/rules/fake-rule)] Fake primary. Fake explanation. Fake suggestion."
		`,
		);
	});

	test("two reports in one group", () => {
		expect(
			markdownReporter(heading, [
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
			"Hi, thanks for the issue, etc.

			[[**fake-rule**](https://octo.guide/rules/fake-rule)] Fake explanation.

			Fake primary. Fake suggestion.

			Fake primary. Fake suggestion."
		`);
	});

	test("two reports across two group", () => {
		expect(
			markdownReporter(heading, [
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
			"Hi, thanks for the issue, etc.

			[[**first**](https://octo.guide/rules/fake-rule)] Fake primary. Fake explanation. Fake suggestion.

			[[**second**](https://octo.guide/rules/fake-rule)] Fake primary. Fake explanation. Fake suggestion."
		`);
	});

	test("four reports across two group", () => {
		expect(
			markdownReporter(heading, [
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
			"Hi, thanks for the issue, etc.

			[[**first**](https://octo.guide/rules/fake-rule)] Fake explanation.

			Fake primary. Fake suggestion.

			Fake primary. Fake suggestion.

			[[**second**](https://octo.guide/rules/fake-rule)] Fake explanation.

			Fake primary. Fake suggestion.

			Fake primary. Fake suggestion."
		`);
	});
});
