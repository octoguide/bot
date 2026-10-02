import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { prTitleConventional } from "./prTitleConventional.js";

describe(prTitleConventional.about.name, () => {
	it("reports when the pull request title is missing a type", async () => {
		const report = vi.fn();
		const title = "add this new feature";

		await testRule(
			prTitleConventional,
			{
				data: {
					title,
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: `The PR title is missing a conventional commit type, such as _"docs: "_ or _"feat: "_.`,
			suggestion: [
				`To resolve this report, add a conventional commit type in front of the title, like _"feat: add this new feature"_.`,
			],
		});
	});

	it.each([
		[
			"fix(md) [headingIncrements]: fill in suggestions TODO md",
			"fix(md): [headingIncrements] fill in suggestions TODO md",
		],
		["fix(md) fill in suggestions", "fix(md): fill in suggestions"],
		["fix:fill in suggestions", "fix: fill in suggestions"],
		["fix : fill in suggestions", "fix: fill in suggestions"],
		["feat(api)! drop old option", "feat(api)!: drop old option"],
	])(
		"reports with a corrected title when the pull request title %j has a known type with incorrect syntax",
		async (title, corrected) => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title,
					},
					type: "pull_request",
				},
				{ report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `The PR title does not follow the conventional commit syntax of _"type: subject"_ or _"type(scope): subject"_.`,
				suggestion: [
					`To resolve this report, follow conventional commit syntax, like _"${corrected}"_.`,
				],
			});
		},
	);

	it("reports a missing type when the pull request title does not start with a word", async () => {
		const report = vi.fn();
		const title = "[docs] update readme";

		await testRule(
			prTitleConventional,
			{
				data: {
					title,
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: `The PR title is missing a conventional commit type, such as _"docs: "_ or _"feat: "_.`,
			suggestion: [
				`To resolve this report, add a conventional commit type in front of the title, like _"feat: [docs] update readme"_.`,
			],
		});
	});

	it("reports when the pull request title has a known type with incorrect syntax and no subject", async () => {
		const report = vi.fn();

		await testRule(
			prTitleConventional,
			{
				data: {
					title: "fix(md)",
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: `PR title is missing a subject after its type.`,
			suggestion: [
				`To resolve this report, add text after the type, like _"fix(md): etc."_`,
			],
		});
	});

	it("reports when the pull request title has an unknown type", async () => {
		const report = vi.fn();
		const title = "other: add this new feature";

		await testRule(
			prTitleConventional,
			{
				data: {
					title,
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: `The PR title has an unknown type: 'other'.`,
			secondary: [
				"Known types are: 'build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'",
			],
			suggestion: [
				`To resolve this report, replace the current type with one of those known types, like _"feat: add this new feature"_.`,
			],
		});
	});

	it("reports when the pull request title has an unknown type with '!'", async () => {
		const report = vi.fn();
		const title = "other!: add this new feature";

		await testRule(
			prTitleConventional,
			{
				data: {
					title,
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: `The PR title has an unknown type: 'other'.`,
			secondary: [
				"Known types are: 'build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'",
			],
			suggestion: [
				`To resolve this report, replace the current type with one of those known types, like _"feat: add this new feature"_.`,
			],
		});
	});

	it("reports when the pull request title has an unknown scoped type with '!'", async () => {
		const report = vi.fn();
		const title = "other(parser)!: add this new feature";

		await testRule(
			prTitleConventional,
			{
				data: {
					title,
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: `The PR title has an unknown type: 'other'.`,
			secondary: [
				"Known types are: 'build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'",
			],
			suggestion: [
				`To resolve this report, replace the current type with one of those known types, like _"feat: add this new feature"_.`,
			],
		});
	});

	it("reports when the pull request title is missing a subject", async () => {
		const report = vi.fn();
		const title = "feat: ";

		await testRule(
			prTitleConventional,
			{
				data: {
					title,
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: `PR title is missing a subject after its type.`,
			suggestion: [
				`To resolve this report, add text after the type, like _"feat: etc."_`,
			],
		});
	});

	it("does not report when the pull request title has both a subject and a type", async () => {
		const report = vi.fn();

		await testRule(
			prTitleConventional,
			{
				data: {
					title: "feat: add this new feature",
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request title has a scoped conventional type", async () => {
		const report = vi.fn();

		await testRule(
			prTitleConventional,
			{
				data: {
					title: "feat(parser): add new feature",
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request title indicates a breaking change with '!'", async () => {
		const report = vi.fn();

		await testRule(
			prTitleConventional,
			{
				data: {
					title: "chore!: make breaking change",
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request title indicates a scoped breaking change with '!'", async () => {
		const report = vi.fn();

		await testRule(
			prTitleConventional,
			{
				data: {
					title: "fix(parser)!: change parser API",
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});
});
