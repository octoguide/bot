import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.ts";
import { prTitleConventional } from "./prTitleConventional.ts";

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

	it("reports with a corrected title when the pull request title has a known type with incorrect syntax", async () => {
		const report = vi.fn();

		await testRule(
			prTitleConventional,
			{
				data: {
					title: "fix(md) fill in suggestions",
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: `The PR title does not follow the conventional commit syntax of _"type: subject"_ or _"type(scope): subject"_.`,
			suggestion: [
				`To resolve this report, follow conventional commit syntax, like _"fix(md): fill in suggestions"_.`,
			],
		});
	});

	it("reports a missing type without a corrected title when the pull request title has a known type but no valid correction", async () => {
		const report = vi.fn();
		const title = "fix something";

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
				`To resolve this report, add a conventional commit type in front of the title, like _"feat: fix something"_.`,
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

	it.each([
		["Feature: Abc Def", "Feature", "feat: Abc Def"],
		["Feat: add this new feature", "Feat", "feat: add this new feature"],
		["FIX(parser): handle semicolons", "FIX", "fix(parser): handle semicolons"],
		[
			"bugfix(parser)!: change parser API",
			"bugfix",
			"fix(parser)!: change parser API",
		],
		["Documentation: mention option", "Documentation", "docs: mention option"],
		["doc: mention option", "doc", "docs: mention option"],
		["Features: add option", "Features", "feat: add option"],
		["fixes: handle semicolons", "fixes", "fix: handle semicolons"],
		["Fixed: handle semicolons", "Fixed", "fix: handle semicolons"],
		["hotfix: handle semicolons", "hotfix", "fix: handle semicolons"],
		["bug: handle semicolons", "bug", "fix: handle semicolons"],
		["builds: bump target", "builds", "build: bump target"],
		["chores(deps): bump x", "chores", "chore(deps): bump x"],
		["refactored: extract helper", "refactored", "refactor: extract helper"],
		["reverts: undo change", "reverts", "revert: undo change"],
		["styles: format files", "styles", "style: format files"],
		["tests: cover parser", "tests", "test: cover parser"],
	])(
		"reports with a corrected title when the pull request title %j has a near-miss type",
		async (title, type, corrected) => {
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
				primary: `The PR title has an unknown type: '${type}'.`,
				secondary: [
					"Known types are: 'build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'",
				],
				suggestion: [
					`To resolve this report, replace the current type with its known equivalent, like _"${corrected}"_.`,
				],
			});
		},
	);

	it("reports without a corrected title when the pull request title has a near-miss type and no subject", async () => {
		const report = vi.fn();

		await testRule(
			prTitleConventional,
			{
				data: {
					title: "Feature: ",
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: `The PR title has an unknown type: 'Feature'.`,
			secondary: [
				"Known types are: 'build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'",
			],
			suggestion: [
				`To resolve this report, replace the current type with one of those known types.`,
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

	it.each([
		["feat(a,b): x", "a,b", "feat(a): x"],
		["feat(a, b): x", "a, b", "feat(a): x"],
		["feat(api/cli): x", "api/cli", "feat(api): x"],
		["feat(api\\cli): x", "api\\cli", "feat(api): x"],
		["feat(a,b)!: x", "a,b", "feat(a)!: x"],
		["feat(a|b): x", "a|b", "feat(a): x"],
		["feat(a;b): x", "a;b", "feat(a): x"],
		["feat(@a/b,c): x", "@a/b,c", "feat(@a/b): x"],
		["feat(c,@a/b): x", "c,@a/b", "feat(c): x"],
	])(
		"reports when the pull request title is %j with multiple scopes",
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
				{ report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `The PR title has multiple scopes: '${scope}'.`,
				secondary: [
					`A conventional commit scope is a single noun describing a section of the codebase.`,
				],
				suggestion: [
					`To resolve this report, keep only one scope, like _"${suggested}"_.`,
				],
			});
		},
	);

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

	it.each([
		"feat(café): x",
		"fix(rule options): x",
		"fix(c++): x",
		"fix(@octoguide/bot): x",
		"fix(@octoguide/bot)!: x",
		"feat(a,): x",
	])(
		"does not report when the pull request title is %j with a single scope",
		async (title) => {
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

			expect(report).not.toHaveBeenCalled();
		},
	);

	describe("types option", () => {
		const options = {
			"include-ais": true,
			"include-bots": true,
			types: ["fix", "deps"],
		};

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
				primary: `The PR title has a type that isn't allowed: 'feat'.`,
				secondary: ["Allowed types are: 'deps', 'fix'"],
				suggestion: [
					`To resolve this report, replace the current type with one of those allowed types, like _"deps: add this new feature"_.`,
				],
			});
		});

		it("reports with a corrected title when the pull request title has a near-miss of an allowed type", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "bugfix(parser): handle semicolons",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `The PR title has a type that isn't allowed: 'bugfix'.`,
				secondary: ["Allowed types are: 'deps', 'fix'"],
				suggestion: [
					`To resolve this report, replace the current type with its allowed equivalent, like _"fix(parser): handle semicolons"_.`,
				],
			});
		});

		it("reports without a corrected title when the pull request title has a near-miss of a type that isn't allowed", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "Feature: add this new feature",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `The PR title has a type that isn't allowed: 'Feature'.`,
				secondary: ["Allowed types are: 'deps', 'fix'"],
				suggestion: [
					`To resolve this report, replace the current type with one of those allowed types, like _"deps: add this new feature"_.`,
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
				{
					options: {
						"include-ais": true,
						"include-bots": true,
						types: ["feat"],
					},
					report,
				},
			);

			expect(report).toHaveBeenCalledWith({
				primary: `The PR title is missing the conventional commit type, such as _"feat: "_.`,
				suggestion: [
					`To resolve this report, add a conventional commit type in front of the title, like _"feat: add this new feature"_.`,
				],
			});
		});
	});

	describe("scopes option", () => {
		const options = {
			"include-ais": true,
			"include-bots": true,
			scopes: ["parser", "cli"],
		};

		it.each([
			"feat: add this new feature",
			"feat(parser): add this new feature",
			"fix(cli)!: change CLI flags",
			"feat( parser ): add this new feature",
			"fix(cli)!: rename `x(y)!: z`",
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
				"feat( website ): add this new feature",
				"website",
				"feat(cli): add this new feature",
			],
			[
				"fix(Parser)!: change parser API",
				"Parser",
				"fix(cli)!: change parser API",
			],
		])(
			"reports when the pull request title %j has a scope that isn't allowed",
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
					primary: `The PR title has a scope that isn't allowed: '${scope}'.`,
					secondary: ["Allowed scopes are: 'cli', 'parser'"],
					suggestion: [
						`To resolve this report, replace the current scope with one of those allowed scopes, like _"${suggested}"_, or remove the scope.`,
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
				{
					options: {
						"include-ais": true,
						"include-bots": true,
						scopes: ["$$"],
					},
					report,
				},
			);

			expect(report).toHaveBeenCalledWith(
				expect.objectContaining({
					suggestion: [
						`To resolve this report, replace the current scope with one of those allowed scopes, like _"feat($$): add this new feature"_, or remove the scope.`,
					],
				}),
			);
		});
	});

	describe("scopes and types options", () => {
		const options = {
			"include-ais": true,
			"include-bots": true,
			scopes: ["parser"],
			types: ["fix"],
		};

		it("does not report when the pull request title has an allowed type and scope", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "fix(parser): handle semicolons",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).not.toHaveBeenCalled();
		});

		it("reports only the type when the pull request title has neither an allowed type nor scope", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "feat(cli): add this new feature",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					primary: `The PR title has a type that isn't allowed: 'feat'.`,
				}),
			);
		});
	});

	describe.each([
		[
			"scopes",
			"ASCII letters, digits, spaces, and _$@.-*/ characters",
			[" web", "ui:web", "a,b"],
		],
		["types", "ASCII letters, digits, and _ characters", ["feat-x", "feat "]],
	])("invalid %s option", (name, characters, invalidItems) => {
		it.each(
			[[], "fix", [""], [1], null, ...invalidItems.map((item) => [item])].map(
				(value) => ({ value }),
			),
		)("throws when the option is $value", async ({ value }) => {
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
						options: {
							"include-ais": true,
							"include-bots": true,
							[name]: value,
						},
						report: vi.fn(),
					},
				),
			).rejects.toThrow(
				`pr-title-conventional's "${name}" option must be a non-empty array of trimmed strings made of ${characters}.`,
			);
		});
	});

	describe("subject-case option", () => {
		const options = {
			"include-ais": true,
			"include-bots": true,
			"subject-case": "lower",
		};

		it.each([
			"feat: add this new feature",
			"feat(cli): add this new feature",
			"fix!: `Thing` renamed",
			"feat: [rule-name] add an option",
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
			["feat: Add this new feature", "feat: add this new feature"],
			["fix(cli)!: Change CLI flags", "fix(cli)!: change CLI flags"],
		])(
			"reports when the pull request title %j starts its subject with an upper-case letter",
			async (title, suggested) => {
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
					primary: `The PR title's subject starts with an upper-case letter: '${title.split(": ")[1]}'.`,
					suggestion: [
						`To resolve this report, lower-case the first letter of the subject, like _"${suggested}"_.`,
					],
				});
			},
		);
	});

	describe("subject-trailing-punctuation option", () => {
		const options = {
			"include-ais": true,
			"include-bots": true,
			"subject-trailing-punctuation": false,
		};

		it.each([
			"feat: add this new feature",
			"feat: add support for `a.b`",
			"fix(cli)!: rename --dry-run",
			"chore(deps): this is a very long pr title that will probably get trun…",
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
			["feat: add this new feature.", ".", "feat: add this new feature"],
			["fix: what even is this?!", "?!", "fix: what even is this"],
			["docs: clarify the thing...", "...", "docs: clarify the thing"],
		])(
			"reports when the pull request title %j ends its subject with punctuation",
			async (title, punctuation, suggested) => {
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
					primary: `The PR title's subject ends with punctuation: '${punctuation}'.`,
					suggestion: [
						`To resolve this report, remove the trailing punctuation, like _"${suggested}"_.`,
					],
				});
			},
		);

		it("reports without a suggested title when the subject is only punctuation", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "feat: ???",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `The PR title's subject ends with punctuation: '???'.`,
				suggestion: [
					`To resolve this report, remove the trailing punctuation from the subject.`,
				],
			});
		});

		it("does not report when the option is true", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "feat: add this new feature.",
					},
					type: "pull_request",
				},
				{
					options: {
						"include-ais": true,
						"include-bots": true,
						"subject-trailing-punctuation": true,
					},
					report,
				},
			);

			expect(report).not.toHaveBeenCalled();
		});
	});

	describe("subject-pattern option", () => {
		const options = {
			"include-ais": true,
			"include-bots": true,
			"subject-pattern": String.raw`^(\[[a-z\-]+(, [a-z\-]+)*\] )?[a-z].+$`,
		};

		it.each([
			"feat: add this new feature",
			"feat: [rule-name] add an option",
			"fix: [rule-one, rule-two] stop crashing",
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

		it("reports with the pattern when the subject does not match and no error is provided", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "feat: [RuleName] add an option",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `The PR title's subject doesn't match the pattern this repository requires: '[RuleName] add an option'.`,
				secondary: [
					"Subjects must match the regular expression `" +
						options["subject-pattern"] +
						"`.",
				],
				suggestion: [
					`To resolve this report, edit the PR title's subject to match that regular expression.`,
				],
			});
		});

		it("reports with the provided error when the subject does not match", async () => {
			const report = vi.fn();
			const subjectPatternError = `ESLint-plugin rule PRs should begin with "[rule-name] ".`;

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "feat: [RuleName] add an option",
					},
					type: "pull_request",
				},
				{
					options: {
						...options,
						"subject-pattern-error": subjectPatternError,
					},
					report,
				},
			);

			expect(report).toHaveBeenCalledWith({
				primary: `The PR title's subject doesn't match the pattern this repository requires: '[RuleName] add an option'.`,
				secondary: [subjectPatternError],
				suggestion: [
					`To resolve this report, edit the PR title's subject to match that description.`,
				],
			});
		});

		it("reports when the subject only partially matches an unanchored pattern", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "feat: add this new feature!",
					},
					type: "pull_request",
				},
				{
					options: {
						"include-ais": true,
						"include-bots": true,
						"subject-pattern": "[a-z ]+",
					},
					report,
				},
			);

			expect(report).toHaveBeenCalledWith(
				expect.objectContaining({
					primary: `The PR title's subject doesn't match the pattern this repository requires: 'add this new feature!'.`,
				}),
			);
		});
	});

	describe("subject options together", () => {
		const options = {
			"include-ais": true,
			"include-bots": true,
			"subject-case": "lower",
			"subject-pattern": String.raw`^(\[[a-z\-]+\] )?[a-z].+$`,
			"subject-trailing-punctuation": false,
		};

		it("does not report when the pull request title satisfies every option", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "feat: [rule-name] add an option",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).not.toHaveBeenCalled();
		});

		it("reports only the case when the pull request title satisfies no subject option", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "feat: Add an option.",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					primary: `The PR title's subject starts with an upper-case letter: 'Add an option.'.`,
				}),
			);
		});

		it("reports only the trailing punctuation when the pull request title also fails the pattern", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "feat: [RuleName] add an option.",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					primary: `The PR title's subject ends with punctuation: '.'.`,
				}),
			);
		});

		it("reports the type before any subject option", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "other: Add an option.",
					},
					type: "pull_request",
				},
				{ options, report },
			);

			expect(report).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					primary: `The PR title has an unknown type: 'other'.`,
				}),
			);
		});

		it("reports the scope before any subject option", async () => {
			const report = vi.fn();

			await testRule(
				prTitleConventional,
				{
					data: {
						title: "feat(other): Add an option.",
					},
					type: "pull_request",
				},
				{ options: { ...options, scopes: ["cli"] }, report },
			);

			expect(report).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					primary: `The PR title has a scope that isn't allowed: 'other'.`,
				}),
			);
		});
	});

	describe("invalid subject options", () => {
		it.each([{ value: "upper" }, { value: true }, { value: 1 }, { value: [] }])(
			"throws when the subject-case option is $value",
			async ({ value }) => {
				await expect(testRuleWithOption("subject-case", value)).rejects.toThrow(
					`pr-title-conventional's "subject-case" option must be one of: 'lower'.`,
				);
			},
		);

		it.each([{ value: "no" }, { value: 1 }, { value: [] }, { value: null }])(
			"throws when the subject-trailing-punctuation option is $value",
			async ({ value }) => {
				await expect(
					testRuleWithOption("subject-trailing-punctuation", value),
				).rejects.toThrow(
					`pr-title-conventional's "subject-trailing-punctuation" option must be a boolean.`,
				);
			},
		);

		it.each([{ value: "" }, { value: " ^.+$" }, { value: 1 }])(
			"throws when the subject-pattern option is $value",
			async ({ value }) => {
				await expect(
					testRuleWithOption("subject-pattern", value),
				).rejects.toThrow(
					`pr-title-conventional's "subject-pattern" option must be a non-empty trimmed string.`,
				);
			},
		);

		it("throws when the subject-pattern option is not a valid regular expression", async () => {
			await expect(testRuleWithOption("subject-pattern", "^(")).rejects.toThrow(
				`pr-title-conventional's "subject-pattern" option must be a valid regular expression.`,
			);
		});

		it.each([{ value: "" }, { value: "oh no " }, { value: false }])(
			"throws when the subject-pattern-error option is $value",
			async ({ value }) => {
				await expect(
					testRuleWithOption("subject-pattern-error", value, {
						"subject-pattern": "^.+$",
					}),
				).rejects.toThrow(
					`pr-title-conventional's "subject-pattern-error" option must be a non-empty trimmed string.`,
				);
			},
		);

		it("throws when the subject-pattern-error option is provided without a subject-pattern", async () => {
			await expect(
				testRuleWithOption("subject-pattern-error", "Oh no."),
			).rejects.toThrow(
				`pr-title-conventional's "subject-pattern-error" option can only be used alongside its "subject-pattern" option.`,
			);
		});
	});

	it("lists duplicate allowed types once", async () => {
		const report = vi.fn();

		await testRule(
			prTitleConventional,
			{
				data: {
					title: "feat: add this new feature",
				},
				type: "pull_request",
			},
			{
				options: {
					"include-ais": true,
					"include-bots": true,
					types: ["fix", "fix"],
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledWith(
			expect.objectContaining({
				secondary: ["Allowed types are: 'fix'"],
			}),
		);
	});
});

async function testRuleWithOption(
	name: string,
	value: unknown,
	rest?: Record<string, unknown>,
) {
	await testRule(
		prTitleConventional,
		{
			data: {
				title: "feat: add this new feature",
			},
			type: "pull_request",
		},
		{
			options: {
				"include-ais": true,
				"include-bots": true,
				...rest,
				[name]: value,
			},
			report: vi.fn(),
		},
	);
}
