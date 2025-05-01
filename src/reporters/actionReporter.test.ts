import type * as core from "@actions/core";

import { describe, expect, Mocked, test, vi } from "vitest";

import type { RuleReportData } from "../types/reports.js";
import type { RuleAboutWithUrl } from "../types/rules.js";

import { actionReporter } from "./actionReporter.js";

const mockCore = {
	info: vi.fn(),
};

vi.mock("@actions/core", () => ({
	get info() {
		return mockCore.info;
	},
}));

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

const fakeDataWithSecondary = {
	...fakeData,
	secondary: ["Fake secondary."],
} satisfies RuleReportData;

const headline = "Hello, world! [octo.guide](https://octo.guide)";

const summary = {
	addHeading: vi.fn(),
	addRaw: vi.fn(),
	addSeparator: vi.fn(),
} as unknown as Mocked<typeof core.summary>;

describe(actionReporter, () => {
	test("one report", async () => {
		await actionReporter(
			headline,
			[
				{
					about: fakeAbout,
					data: fakeData,
				},
			],
			summary as typeof core.summary,
		);

		expect(summary.addHeading.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "OctoGuide Report",
			    1,
			  ],
			  [
			    "<a href="https://octo.guide/rules/fake-rule">fake-rule</a>",
			    2,
			  ],
			]
		`);
		expect(summary.addRaw.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "<p>Hello, world! <a href="https://octo.guide">octo.guide</a></p>


			",
			  ],
			  [
			    "<p>Fake explanation.</p>
			",
			  ],
			  [
			    "<p>Fake primary.</p>
			",
			  ],
			  [
			    "<p>Fake suggestion.</p>
			",
			  ],
			  [
			    "🗺️ <em>This message was posted automatically by <a href="https://github.com/JoshuaKGoldberg/OctoGuide">OctoGuide</a>: a bot for GitHub repository best practices.</em>",
			  ],
			]
		`);
	});

	test("two reports in one group", async () => {
		await actionReporter(
			headline,
			[
				{
					about: fakeAbout,
					data: fakeData,
				},
				{
					about: fakeAbout,
					data: fakeData,
				},
			],
			summary as typeof core.summary,
		);

		expect(summary.addHeading.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "OctoGuide Report",
			    1,
			  ],
			  [
			    "<a href="https://octo.guide/rules/fake-rule">fake-rule</a>",
			    2,
			  ],
			]
		`);
		expect(summary.addRaw.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "<p>Hello, world! <a href="https://octo.guide">octo.guide</a></p>


			",
			  ],
			  [
			    "<p>Fake explanation.</p>
			",
			  ],
			  [
			    "<p>Fake primary.</p>
			",
			  ],
			  [
			    "<p>Fake suggestion.</p>
			",
			  ],
			  [
			    "<p>Fake primary.</p>
			",
			  ],
			  [
			    "<p>Fake suggestion.</p>
			",
			  ],
			  [
			    "🗺️ <em>This message was posted automatically by <a href="https://github.com/JoshuaKGoldberg/OctoGuide">OctoGuide</a>: a bot for GitHub repository best practices.</em>",
			  ],
			]
		`);
	});

	test("two reports across two group", async () => {
		await actionReporter(
			headline,
			[
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
			],
			summary as typeof core.summary,
		);

		expect(summary.addHeading.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "OctoGuide Report",
			    1,
			  ],
			  [
			    "<a href="https://octo.guide/rules/fake-rule">first</a>",
			    2,
			  ],
			  [
			    "<a href="https://octo.guide/rules/fake-rule">second</a>",
			    2,
			  ],
			]
		`);
		expect(summary.addRaw.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "<p>Hello, world! <a href="https://octo.guide">octo.guide</a></p>


			",
			  ],
			  [
			    "<p>Fake explanation.</p>
			",
			  ],
			  [
			    "<p>Fake primary.</p>
			",
			  ],
			  [
			    "<p>Fake suggestion.</p>
			",
			  ],
			  [
			    "<p>Fake explanation.</p>
			",
			  ],
			  [
			    "<p>Fake primary.</p>
			",
			  ],
			  [
			    "<p>Fake suggestion.</p>
			",
			  ],
			  [
			    "🗺️ <em>This message was posted automatically by <a href="https://github.com/JoshuaKGoldberg/OctoGuide">OctoGuide</a>: a bot for GitHub repository best practices.</em>",
			  ],
			]
		`);
	});

	test("four reports across two group", async () => {
		await actionReporter(
			headline,
			[
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
					data: fakeDataWithSecondary,
				},
				{
					about: {
						...fakeAbout,
						name: "first",
					},
					data: fakeDataWithSecondary,
				},
				{
					about: {
						...fakeAbout,
						name: "second",
					},
					data: fakeData,
				},
			],
			summary as typeof core.summary,
		);

		expect(summary.addHeading.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "OctoGuide Report",
			    1,
			  ],
			  [
			    "<a href="https://octo.guide/rules/fake-rule">first</a>",
			    2,
			  ],
			  [
			    "<a href="https://octo.guide/rules/fake-rule">second</a>",
			    2,
			  ],
			]
		`);
		expect(summary.addRaw.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "<p>Hello, world! <a href="https://octo.guide">octo.guide</a></p>


			",
			  ],
			  [
			    "<p>Fake explanation.</p>
			",
			  ],
			  [
			    "<p>Fake primary.</p>
			",
			  ],
			  [
			    "<p>Fake suggestion.</p>
			",
			  ],
			  [
			    "<p>Fake primary.</p>
			",
			  ],
			  [
			    "<p>Fake secondary.</p>
			",
			  ],
			  [
			    "<p>Fake suggestion.</p>
			",
			  ],
			  [
			    "<p>Fake explanation.</p>
			",
			  ],
			  [
			    "<p>Fake primary.</p>
			",
			  ],
			  [
			    "<p>Fake secondary.</p>
			",
			  ],
			  [
			    "<p>Fake suggestion.</p>
			",
			  ],
			  [
			    "<p>Fake primary.</p>
			",
			  ],
			  [
			    "<p>Fake suggestion.</p>
			",
			  ],
			  [
			    "🗺️ <em>This message was posted automatically by <a href="https://github.com/JoshuaKGoldberg/OctoGuide">OctoGuide</a>: a bot for GitHub repository best practices.</em>",
			  ],
			]
		`);
	});
});
