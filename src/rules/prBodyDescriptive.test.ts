import type { Octokit } from "octokit";

import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { prBodyDescriptive } from "./prBodyDescriptive.js";

describe(prBodyDescriptive.about.name, () => {
	it("reports when the pull request has no description", async () => {
		const report = vi.fn();

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body: null,
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: "This PR doesn't have a description.",
			suggestion: [
				"Please add a description explaining the purpose and changes in this PR.",
			],
		});
	});

	it("reports when the pull request has an empty description and no template exists", async () => {
		const report = vi.fn();

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body: "   ",
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {},
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockRejectedValue(new Error("Not found")),
						},
					},
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledWith({
			primary: "This PR's description doesn't contain any words.",
			suggestion: ["Please add at least a brief explanation of the changes."],
		});
	});

	it("reports when the pull request only contains template content", async () => {
		const report = vi.fn();
		const templateContent = "## Description\n\nPlease describe your changes";
		const body = "## Description\n\nPlease describe your changes";

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body,
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							file0: { text: templateContent },
						},
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from(templateContent).toString("base64"),
									type: "file",
								},
							}),
						},
					},
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledWith({
			primary:
				"This PR's description doesn't contain any content beyond the template.",
			suggestion: [
				"Please add a description explaining the purpose and changes in this PR.",
			],
		});
	});

	it.each([
		"#123",
		"(#123).",
		"owner/repo#123",
		"GH-123",
		"fixes #123",
		"Closes #123",
		"Resolves: #123",
		"Fixed #123",
		"FIX owner/repo#123",
		"closes GH-123",
		"Fixes #1, fixes #2, #3",
		"fixes https://github.com/owner/repo/issues/123",
		"fixes https://github.com/owner/repo/pull/123",
		"resolved https://github.com/owner/repo/discussions/123",
		"https://github.com/owner/repo/issues/123#issuecomment-456",
		"https://github.com/owner/repo/pull/123/files",
		"https://github.com/owner/repo/pull/123/files#diff-abc123",
		"https://github.com/owner/repo/pull/123/commits/abc123?w=1",
		"http://github.com/owner/repo/issues/123",
		"https://www.github.com/owner/repo/issues/123",
		"HTTPS://GITHUB.COM/owner/repo/issues/123",
		"[#123](https://github.com/owner/repo/pull/123)",
	])(
		"reports when the pull request only adds an issue reference beyond the template: %s",
		async (reference) => {
			const report = vi.fn();
			const templateContent = "## Overview";
			const body = `## Overview\n\n${reference}`;

			await testRule(
				prBodyDescriptive,
				{
					data: {
						body,
					},
					type: "pull_request",
				},
				{
					octokit: {
						graphql: vi.fn().mockResolvedValue({
							repository: {
								file0: { text: templateContent },
							},
						}) as unknown as Octokit["graphql"],
					},
					report,
				},
			);

			expect(report).toHaveBeenCalledWith({
				primary:
					"This PR's description doesn't contain any content beyond the template.",
				suggestion: [
					"Please add a description explaining the purpose and changes in this PR.",
				],
			});
		},
	);

	it("reports when the pull request body is only an issue reference", async () => {
		const report = vi.fn();
		const templateContent = "## Overview\n\nfixes #000";

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body: "#123",
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							file0: { text: templateContent },
						},
					}) as unknown as Octokit["graphql"],
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledWith({
			primary:
				"This PR's description doesn't contain any content beyond the template.",
			suggestion: [
				"Please add a description explaining the purpose and changes in this PR.",
			],
		});
	});

	it("does not report when the pull request has content beyond the template and an issue reference", async () => {
		const report = vi.fn();
		const templateContent = "## Overview\n\nfixes #000";
		const body = "## Overview\n\nfixes #123\n\nUpdates the login logic.";

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body,
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							file0: { text: templateContent },
						},
					}) as unknown as Octokit["graphql"],
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it.each([
		"C#",
		"#fff",
		"## Heading",
		"Like #12 but for X",
		"#12 resolved",
		"Resolved",
		"fix#1es",
		"https://github.com/o/r/issues/1#issuecomment-123，修复了解析器的错误。",
		"|https://github.com/o/r/pull/1/files|Refactor|",
	])(
		"does not report when the pull request adds words that aren't issue references: %s",
		async (text) => {
			const report = vi.fn();
			const templateContent = "## Overview\n\nfixes #000";
			const body = `## Overview\n\n${text}`;

			await testRule(
				prBodyDescriptive,
				{
					data: {
						body,
					},
					type: "pull_request",
				},
				{
					octokit: {
						graphql: vi.fn().mockResolvedValue({
							repository: {
								file0: { text: templateContent },
							},
						}) as unknown as Octokit["graphql"],
					},
					report,
				},
			);

			expect(report).not.toHaveBeenCalled();
		},
	);

	it("handles a long run of word characters quickly", async () => {
		const report = vi.fn();
		const start = performance.now();

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body: "a".repeat(65_536),
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							file0: { text: "## Overview" },
						},
					}) as unknown as Octokit["graphql"],
				},
				report,
			},
		);

		expect(performance.now() - start).toBeLessThan(100);
		expect(report).not.toHaveBeenCalled();
	});

	it.each([
		["- [ ]", "- [x]"],
		["- [ ]", "- [X]"],
		["* [ ]", "+ [x]"],
		["  - [ ]", "  - [x]"],
		["1. [ ]", "1. [x]"],
		["1) [ ]", "1) [x]"],
	])(
		"reports when the pull request only ticks task list items and adds an issue reference beyond the template: %s to %s",
		async (templateMarker, bodyMarker) => {
			const report = vi.fn();
			const templateContent = `## Checklist\n\n${templateMarker} Fixes #000\n${templateMarker} Tests added\n\n## Description\n`;
			const body = `## Checklist\n\n${bodyMarker} Fixes #123\n${bodyMarker} Tests added\n\n## Description\n`;

			await testRule(
				prBodyDescriptive,
				{
					data: {
						body,
					},
					type: "pull_request",
				},
				{
					octokit: {
						graphql: vi.fn().mockResolvedValue({
							repository: {
								file0: { text: templateContent },
							},
						}) as unknown as Octokit["graphql"],
					},
					report,
				},
			);

			expect(report).toHaveBeenCalledWith({
				primary:
					"This PR's description doesn't contain any content beyond the template.",
				suggestion: [
					"Please add a description explaining the purpose and changes in this PR.",
				],
			});
		},
	);

	it("does not report when the pull request ticks task list items and adds words beyond the template", async () => {
		const report = vi.fn();
		const templateContent =
			"## Checklist\n\n- [ ] Fixes #000\n- [ ] Tests added\n\n## Description\n";
		const body =
			"## Checklist\n\n- [x] Fixes #123\n- [x] Tests added\n\n## Description\n\nUpdates the login logic.";

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body,
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							file0: { text: templateContent },
						},
					}) as unknown as Octokit["graphql"],
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it.each(["🚀", "---"])(
		"reports when the pull request body has no words and no template exists: %s",
		async (body) => {
			const report = vi.fn();

			await testRule(
				prBodyDescriptive,
				{
					data: {
						body,
					},
					type: "pull_request",
				},
				{
					octokit: {
						graphql: vi.fn().mockResolvedValue({
							repository: {},
						}) as unknown as Octokit["graphql"],
					},
					report,
				},
			);

			expect(report).toHaveBeenCalledWith({
				primary: "This PR's description doesn't contain any words.",
				suggestion: ["Please add at least a brief explanation of the changes."],
			});
		},
	);

	it.each([
		"#123",
		"fixes #123",
		"- Closes owner/repo#123.",
		"- [x] fixes #123",
	])(
		"reports when the pull request body is only an issue reference and no template exists: %s",
		async (body) => {
			const report = vi.fn();

			await testRule(
				prBodyDescriptive,
				{
					data: {
						body,
					},
					type: "pull_request",
				},
				{
					octokit: {
						graphql: vi.fn().mockResolvedValue({
							repository: {},
						}) as unknown as Octokit["graphql"],
					},
					report,
				},
			);

			expect(report).toHaveBeenCalledWith({
				primary: "This PR's description doesn't contain any words.",
				suggestion: ["Please add at least a brief explanation of the changes."],
			});
		},
	);

	it("does not report when the pull request has content and an issue reference without a template", async () => {
		const report = vi.fn();

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body: "Fixes #123 by updating the login logic.",
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {},
					}) as unknown as Octokit["graphql"],
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request has content without a template", async () => {
		const report = vi.fn();

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body: "This is a description of my changes",
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {},
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockRejectedValue(new Error("Not found")),
						},
					},
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request has content beyond the template", async () => {
		const report = vi.fn();
		const templateContent = "## Description\n\nPlease describe your changes";
		const body =
			"## Description\n\nI fixed the login issue by updating the auth logic";

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body,
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							file0: { text: templateContent },
						},
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from(templateContent).toString("base64"),
									type: "file",
								},
							}),
						},
					},
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("correctly handles special characters in PR description and template", async () => {
		const report = vi.fn();
		const templateContent =
			"## Description\n\nPlease describe your changes! (required)";
		const body =
			"## Description\n\nFixed bug #123 & improved performance by 50%";

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body,
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							file0: { text: templateContent },
						},
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from(templateContent).toString("base64"),
									type: "file",
								},
							}),
						},
					},
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("handles case insensitivity correctly", async () => {
		const report = vi.fn();
		const templateContent = "## Description\n\nPlease DESCRIBE your changes";
		const body = "## Description\n\nPlease describe YOUR changes";

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body,
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							file0: { text: templateContent },
						},
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from(templateContent).toString("base64"),
									type: "file",
								},
							}),
						},
					},
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledWith({
			primary:
				"This PR's description doesn't contain any content beyond the template.",
			suggestion: [
				"Please add a description explaining the purpose and changes in this PR.",
			],
		});
	});

	it("correctly handles non-latin characters", async () => {
		const report = vi.fn();
		// cspell:disable-next-line
		const templateContent = "## Description\n\nОпишите ваши изменения";
		// cspell:disable-next-line
		const body = "## Description\n\nИсправлена ошибка аутентификации";

		await testRule(
			prBodyDescriptive,
			{
				data: {
					body,
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							file0: { text: templateContent },
						},
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from(templateContent).toString("base64"),
									type: "file",
								},
							}),
						},
					},
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});
});
