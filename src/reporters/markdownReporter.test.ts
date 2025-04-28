import { describe, expect, test } from "vitest";

import type { Entity, IssueData } from "../types/entities.js";

import { CoreRuleAbout } from "../types/core.js";
import { RuleReportData } from "../types/reports.js";
import { markdownReporter } from "./markdownReporter.js";

const fakeAbout = {
	config: "recommended",
	description: "Fake description.",
	explanation: ["Fake explanation."],
	name: "fake-rule",
} satisfies CoreRuleAbout;

const fakeData = {
	primary: "Fake primary.",
	suggestion: ["Fake suggestion."],
} satisfies RuleReportData;

const fakeEntity = {
	data: {
		html_url: "fake-html-url",
		id: 123,
		url: "fake-url",
	} as IssueData,
	number: 123,
	type: "issue",
} satisfies Entity;

describe(markdownReporter, () => {
	test("one report", () => {
		expect(
			markdownReporter(fakeEntity, [
				{
					about: fakeAbout,
					data: fakeData,
				},
			]),
		).toMatchInlineSnapshot(`
			"👋 Hi, thanks for the issue! A scan flagged a concern with it. Could you please take a look?

			[[**fake-rule**](https://github.com/JoshuaKGoldberg/octoguide/blob/main/docs/rules/fake-rule.md)] Fake primary. Fake explanation. Fake suggestion."
		`);
	});

	test("two reports in one group", () => {
		expect(
			markdownReporter(fakeEntity, [
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
			"👋 Hi, thanks for the issue! A scan flagged some concerns with it. Could you please take a look?

			[[**fake-rule**](https://github.com/JoshuaKGoldberg/octoguide/blob/main/docs/rules/fake-rule.md)] Fake explanation.

			Fake primary. Fake suggestion.

			Fake primary. Fake suggestion."
		`);
	});

	test("two reports across two group", () => {
		expect(
			markdownReporter(fakeEntity, [
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
			"👋 Hi, thanks for the issue! A scan flagged some concerns with it. Could you please take a look?

			[[**first**](https://github.com/JoshuaKGoldberg/octoguide/blob/main/docs/rules/first.md)] Fake primary. Fake explanation. Fake suggestion.

			[[**second**](https://github.com/JoshuaKGoldberg/octoguide/blob/main/docs/rules/second.md)] Fake primary. Fake explanation. Fake suggestion."
		`);
	});

	test("four reports across two group", () => {
		expect(
			markdownReporter(fakeEntity, [
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
			"👋 Hi, thanks for the issue! A scan flagged some concerns with it. Could you please take a look?

			[[**first**](https://github.com/JoshuaKGoldberg/octoguide/blob/main/docs/rules/first.md)] Fake explanation.

			Fake primary. Fake suggestion.

			Fake primary. Fake suggestion.

			[[**second**](https://github.com/JoshuaKGoldberg/octoguide/blob/main/docs/rules/second.md)] Fake explanation.

			Fake primary. Fake suggestion.

			Fake primary. Fake suggestion."
		`);
	});
});
