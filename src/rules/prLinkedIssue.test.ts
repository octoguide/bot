import type { Octokit } from "octokit";

import { describe, expect, it, type Mock, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { prLinkedIssue } from "./prLinkedIssue.js";

describe(prLinkedIssue.about.name, () => {
	it("does not report when the pull request has a closing issue reference", async () => {
		const report = vi.fn();

		await testRule(
			prLinkedIssue,
			{
				data: {
					head: {
						ref: "patch-1",
					},
				},
				number: 2,
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							pullRequest: {
								closingIssuesReferences: {
									nodes: [{ number: 1 }],
								},
							},
						},
					}) as unknown as Octokit["graphql"],
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("reports when the pull request does not have a closing issue reference", async () => {
		const report = vi.fn();

		await testRule(
			prLinkedIssue,
			{
				data: {
					base: {
						ref: "main",
						repo: { default_branch: "main" },
					},
					head: {
						ref: "main",
					},
				},
				number: 2,
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							pullRequest: {
								closingIssuesReferences: {
									nodes: [],
								},
							},
						},
					}) as unknown as Octokit["graphql"],
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledWith({
			primary: "This pull request is not linked as closing any issues.",
			suggestion: [
				"To resolve this report:",
				"* If this is a straightforward documentation change that doesn't need an issue, you can ignore this report",
				"* If there is a backing issue, add a 'fixes #...' link to the pull request body",
				"* If addressing a Dependabot alert, add a link to the alert (e.g., https://github.com/owner/repo/security/dependabot/123)",
				"* Otherwise, file an issue explaining what you'd like to happen",
			],
		});
	});

	it("does not report when the pull request body contains a Dependabot alert link", async () => {
		const report = vi.fn();

		await testRule(
			prLinkedIssue,
			{
				data: {
					body: "fixes: https://github.com/OctoGuide/bot/security/dependabot/85",
					head: {
						ref: "dependabot-patch",
					},
				},
				number: 3,
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							pullRequest: {
								closingIssuesReferences: {
									nodes: [],
								},
							},
						},
					}) as unknown as Octokit["graphql"],
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	describe("pull requests into a non-default branch", () => {
		const testStackedPullRequest = async (
			body: string,
			getIssue: Mock,
			template?: string,
			fork = false,
		) => {
			const report = vi.fn();

			await testRule(
				prLinkedIssue,
				{
					data: {
						base: {
							ref: "stacked-base",
							repo: { default_branch: "main", fork },
						},
						body,
					},
					number: 2,
					type: "pull_request",
				},
				{
					octokit: {
						graphql: vi
							.fn()
							.mockResolvedValueOnce({
								repository: {
									pullRequest: {
										closingIssuesReferences: {
											nodes: [],
										},
									},
								},
							})
							.mockResolvedValueOnce({
								repository: template ? { file0: { text: template } } : {},
							}) as unknown as Octokit["graphql"],
						rest: { issues: { get: getIssue } },
					},
					report,
				},
			);

			return report;
		};

		it.each([
			"fixes #1",
			"FIXES: #1",
			"Closes test-owner/test-repo#1",
			"resolved https://github.com/Test-Owner/test-repo/issues/1",
			"- [x] Addresses an existing open issue: fixes #1",
			"See:\n\n> fixes #1.",
			"Fixes [#1](https://github.com/test-owner/test-repo/issues/1)",
			"Fixes [the crash](https://github.com/test-owner/test-repo/issues/1)",
			"Fixes [1](https://github.com/test-owner/test-repo/issues/1)",
			"Fixes https://github.com/test-owner/test-repo/pull/1",
			"Fixes : #1",
			"Closes GH-1",
			"fixes test-owner#1",
			"fixes Test-Owner#1",
		])(
			"does not report when the body has a closing keyword on an existing issue: %s",
			async (body) => {
				const getIssue = vi.fn().mockResolvedValue({ data: {} });

				const report = await testStackedPullRequest(body, getIssue);

				expect(getIssue).toHaveBeenCalledWith({ issue_number: 1 });
				expect(report).not.toHaveBeenCalled();
			},
		);

		it.each([
			"Closes owner/repo#1",
			"resolved: https://github.com/owner/repo/issues/1",
			"fixes [#1](https://github.com/owner/repo/issues/1)",
		])(
			"does not report or look up a closing keyword on an issue in another repository: %s",
			async (body) => {
				const getIssue = vi.fn();

				const report = await testStackedPullRequest(body, getIssue);

				expect(getIssue).not.toHaveBeenCalled();
				expect(report).not.toHaveBeenCalled();
			},
		);

		it("reports when the closing keyword is on a pull request", async () => {
			const getIssue = vi
				.fn()
				.mockResolvedValue({ data: { pull_request: {} } });

			const report = await testStackedPullRequest("fixes #1", getIssue);

			expect(report).toHaveBeenCalledOnce();
		});

		it("reports when the closing keyword is on an issue that does not exist", async () => {
			const getIssue = vi
				.fn()
				.mockRejectedValue(
					Object.assign(new Error("Not Found"), { status: 404 }),
				);

			const report = await testStackedPullRequest("fixes #1", getIssue);

			expect(report).toHaveBeenCalledOnce();
		});

		it.each([
			"fixes https://github.com/test-owner/test-repo/issues/1",
			"fixes [#1](https://github.com/test-owner/test-repo/issues/1)",
		])(
			"reports when the closing keyword is on a URL to an issue that does not exist in a fork: %s",
			async (body) => {
				const getIssue = vi
					.fn()
					.mockRejectedValue(
						Object.assign(new Error("Not Found"), { status: 404 }),
					);

				const report = await testStackedPullRequest(
					body,
					getIssue,
					undefined,
					true,
				);

				expect(getIssue).toHaveBeenCalledWith({ issue_number: 1 });
				expect(report).toHaveBeenCalledOnce();
			},
		);

		it.each([
			"fixes #1",
			"fixes https://github.com/test-owner/test-repo/issues/1\nfixes #1",
			"fixes #1\nfixes https://github.com/test-owner/test-repo/issues/1",
		])(
			"does not report when a shorthand closing keyword is on an issue that does not exist in a fork: %j",
			async (body) => {
				const getIssue = vi
					.fn()
					.mockRejectedValue(
						Object.assign(new Error("Not Found"), { status: 404 }),
					);

				const report = await testStackedPullRequest(
					body,
					getIssue,
					undefined,
					true,
				);

				expect(getIssue).toHaveBeenCalledWith({ issue_number: 1 });
				expect(report).not.toHaveBeenCalled();
			},
		);

		it.each([
			Object.assign(new Error("Forbidden"), { status: 403 }),
			Object.assign(new Error("Server Error"), { status: 500 }),
			new Error("Network Error"),
		])(
			"does not report when looking up the issue fails with: %s",
			async (error) => {
				const getIssue = vi.fn().mockRejectedValue(error);

				const report = await testStackedPullRequest("fixes #1", getIssue);

				expect(report).not.toHaveBeenCalled();
			},
		);

		it("does not report when a later closing keyword is on an existing issue", async () => {
			const getIssue = vi
				.fn()
				.mockResolvedValueOnce({ data: { pull_request: {} } })
				.mockResolvedValueOnce({ data: {} });

			const report = await testStackedPullRequest(
				"fixes #2\nfixes #1",
				getIssue,
			);

			expect(getIssue).toHaveBeenNthCalledWith(1, { issue_number: 2 });
			expect(getIssue).toHaveBeenNthCalledWith(2, { issue_number: 1 });
			expect(report).not.toHaveBeenCalled();
		});

		it("reports when the only closing keyword is unchanged from the pull request template", async () => {
			const getIssue = vi.fn().mockResolvedValue({ data: {} });

			const report = await testStackedPullRequest(
				"- [x] Addresses an existing open issue: fixes #000\n\nChanges things.",
				getIssue,
				"- [ ] Addresses an existing open issue: fixes #000",
			);

			expect(getIssue).not.toHaveBeenCalled();
			expect(report).toHaveBeenCalledOnce();
		});

		it("does not report when the pull request template's closing keyword is filled in", async () => {
			const getIssue = vi.fn().mockResolvedValue({ data: {} });

			const report = await testStackedPullRequest(
				"- [x] Addresses an existing open issue: fixes #1",
				getIssue,
				"- [ ] Addresses an existing open issue: fixes #000",
			);

			expect(getIssue).toHaveBeenCalledWith({ issue_number: 1 });
			expect(report).not.toHaveBeenCalled();
		});

		it("does not report when the closing keyword is in an HTML block", async () => {
			const getIssue = vi.fn().mockResolvedValue({ data: {} });

			const report = await testStackedPullRequest(
				"<div>fixes #1</div>",
				getIssue,
			);

			expect(report).not.toHaveBeenCalled();
		});

		it.each([
			"```\nfixes #1\n```",
			"~~~md\nfixes #1\n~~~",
			"Example:\n\n    fixes #1",
			"`fixes #1`",
			"fixes `#1`",
			"<!-- fixes #1 -->",
			"<div><!-- fixes #1 --></div>",
			"Text <!-- fixes #1 --> text",
			"fixes\n#1",
			"fixes #1abc",
			"pre-fix #1",
			"prefixes #1",
			"Builds on #1.",
			"- [x] **Closes:** #1",
			"**Fixes** #1",
			"already **closed**: **#1**",
			"[Fixes](https://example.com) #1",
			"fixes **#1**",
			"fixes _#1_",
			"fixes ~~#1~~",
			"closes [owner/repo#1](https://redirect.github.com/owner/repo/issues/1)",
			"Closes owner#1",
			"Resolves GH#1",
			"fixes gh-#1",
			"fixes https://github.com/owner/repo/pull/1",
			"fixes [the fix](https://github.com/owner/repo/pull/1)",
		])(
			"reports when the body only has text GitHub wouldn't treat as a closing keyword: %s",
			async (body) => {
				const getIssue = vi.fn().mockResolvedValue({ data: {} });

				const report = await testStackedPullRequest(body, getIssue);

				expect(getIssue).not.toHaveBeenCalled();
				expect(report).toHaveBeenCalledOnce();
			},
		);
	});

	it("reports when a pull request into the default branch has a closing keyword in its body that GitHub did not link", async () => {
		const report = vi.fn();

		await testRule(
			prLinkedIssue,
			{
				data: {
					base: {
						ref: "main",
						repo: { default_branch: "main" },
					},
					body: "fixes #1",
				},
				number: 2,
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							pullRequest: {
								closingIssuesReferences: {
									nodes: [],
								},
							},
						},
					}) as unknown as Octokit["graphql"],
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledOnce();
	});

	it.each([
		{ body: "fixes #1" },
		{ base: { ref: "stacked-base" }, body: "fixes #1" },
	])(
		"reports when the pull request data is missing its base repository: %o",
		async (data) => {
			const report = vi.fn();

			await testRule(
				prLinkedIssue,
				{
					data,
					number: 2,
					type: "pull_request",
				},
				{
					octokit: {
						graphql: vi.fn().mockResolvedValue({
							repository: {
								pullRequest: {
									closingIssuesReferences: {
										nodes: [],
									},
								},
							},
						}) as unknown as Octokit["graphql"],
					},
					report,
				},
			);

			expect(report).toHaveBeenCalledOnce();
		},
	);
});
