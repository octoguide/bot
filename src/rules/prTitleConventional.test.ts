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

	describe("types option", () => {
		const options = { "include-bots": true, types: ["fix", "deps"] };

		it("does not report when the pull request title has an allowed type", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "deps: bump everything",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).not.toHaveBeenCalled();
		});

		it("reports when the pull request title has a known type that isn't allowed", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "feat: add this new feature",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `The PR title has an unknown type: 'feat'.`,
				secondary: ["Known types are: 'deps', 'fix'"],
				suggestion: [
					`To resolve this report, replace the current type with one of those known types, like _"deps: add this new feature"_.`,
				],
			});
		});

		it("reports with allowed example types when the pull request title is missing a type", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "add this new feature",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `The PR title is missing a conventional commit type, such as _"deps: "_ or _"fix: "_.`,
				suggestion: [
					`To resolve this report, add a conventional commit type in front of the title, like _"deps: add this new feature"_.`,
				],
			});
		});

		it("reports with one example type when only one type is allowed", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "add this new feature",
					},
					type: "pull_request",
				},
				{ options: { "include-bots": true, types: ["feat"] }, report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `The PR title is missing a conventional commit type, such as _"feat: "_.`,
				suggestion: [
					`To resolve this report, add a conventional commit type in front of the title, like _"feat: add this new feature"_.`,
				],
			});
		});
	});

	describe("scopes option", () => {
		const options = { "include-bots": true, scopes: ["parser", "cli"] };

		it.each([
			"feat: add this new feature",
			"feat(parser): add this new feature",
			"fix(cli)!: change CLI flags",
		])("does not report when the pull request title is %j", async (title) => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title,
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).not.toHaveBeenCalled();
		});

		it.each([
			[
				"feat(website): add this new feature",
				"website",
				"feat(cli): add this new feature",
			],
			[
				"fix(Parser)!: change parser API",
				"Parser",
				"fix(cli)!: change parser API",
			],
		])(
			"reports when the pull request title %j has an unknown scope",
			async (title, scope, suggested) => {
				const report = vi.fn();

				await testRule(
					prTitleConventional,
					{
						data: {
							title,
						},
						type: "pull_request",
					},
					{ options, report },
				);

				expect(report).toHaveBeenCalledWith({
					primary: `The PR title has an unknown scope: '${scope}'.`,
					secondary: ["Known scopes are: 'cli', 'parser'"],
					suggestion: [
						`To resolve this report, replace the current scope with one of those known scopes, like _"${suggested}"_, or remove the scope.`,
					],
				});
			},
		);

		it("keeps special replacement characters in allowed scopes in its suggestion", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "feat(other): add this new feature",
					},
					type: "pull_request",
				},
				{ options: { "include-bots": true, scopes: ["$&"] }, report },
			);

			expect(report).toHaveBeenCalledWith(
				expect.objectContaining({
					suggestion: [
						`To resolve this report, replace the current scope with one of those known scopes, like _"feat($&): add this new feature"_, or remove the scope.`,
					],
				}),
			);
		});
	});

	describe.each(["scopes", "types"])("invalid %s option", (name) => {
		it.each([[[]], ["fix"], [[""]], [[1]], [null]])(
			"throws when the option is %j",
			async (value) => {
				await expect(
					testRule(
						prTitleConventional,
						{
							data: {
								title: "feat: add this new feature",
							},
							type: "pull_request",
						},
						{
							options: { "include-bots": true, [name]: value },
							report: vi.fn(),
						},
					),
				).rejects.toThrow(
					`pr-title-conventional's "${name}" option must be a non-empty array of non-empty strings.`,
				);
			},
		);
	});
});
