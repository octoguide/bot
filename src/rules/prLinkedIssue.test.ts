import type { Octokit } from "octokit";

import { describe, expect, it, vi } from "vitest";

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

	describe("closing keywords in the body", () => {
		const closesIssue = `<p dir="auto"><span class="issue-keyword">closes</span>: <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5642943017" data-permission-text="Title is private" data-url="https://github.com/example-org/example/issues/4744" data-hovercard-type="issue" data-hovercard-url="/example-org/example/issues/4744/hovercard" href="https://github.com/example-org/example/issues/4744">#4744</a></p>`;

		const testBodyHTML = async (
			bodyHTML: string,
			data: object = {
				base: {
					ref: "feature",
					repo: { default_branch: "main" },
				},
			},
		) => {
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
									bodyHTML,
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

			return report;
		};

		it.each([
			[
				"fixes #3",
				`<li class="task-list-item"><input type="checkbox" id="" disabled="" class="task-list-item-checkbox" aria-label="Completed task" checked=""> Addresses an existing open issue: <span class="issue-keyword">fixes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5539994529" data-permission-text="Title is private" data-url="https://github.com/example/example/issues/3" data-hovercard-type="issue" data-hovercard-url="/example/example/issues/3/hovercard" href="https://github.com/example/example/issues/3">#3</a></li>`,
			],
			["closes: #4744", closesIssue],
			[
				"Fixes: GH-123",
				`<p dir="auto"><span class="issue-keyword">Fixes</span>: <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5574482310" data-permission-text="Title is private" data-url="https://github.com/example/example-repo/issues/123" data-hovercard-type="issue" data-hovercard-url="/example/example-repo/issues/123/hovercard" href="https://github.com/example/example-repo/issues/123">GH-123</a></p>`,
			],
			[
				"Fixes example-org/example-app#1234",
				`<p dir="auto"><span class="issue-keyword">Fixes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5653515580" data-permission-text="Title is private" data-url="https://github.com/example-org/example-app/issues/1234" data-hovercard-type="issue" data-hovercard-url="/example-org/example-app/issues/1234/hovercard" href="https://github.com/example-org/example-app/issues/1234">example-org/example-app#1234</a></p>`,
			],
			[
				"Fixes #1234 in a fork, for its parent repository's issue",
				`<p dir="auto">Link related issues: "<span class="issue-keyword" aria-label="This pull request closes issue #1234.">Fixes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="275232423" data-permission-text="Title is private" data-url="https://github.com/ray-project/ray/issues/1234" data-hovercard-type="issue" data-hovercard-url="/ray-project/ray/issues/1234/hovercard" href="https://github.com/ray-project/ray/issues/1234">ray-project#1234</a>"</p>`,
			],
			[
				"fixes [this issue](https://github.com/example/example/issues/1234)",
				`<p dir="auto">This <span class="issue-keyword" aria-label="This pull request closes issue #1234.">fixes</span> <a href="https://github.com/example/example/issues/1234" data-hovercard-type="issue" data-hovercard-url="/example/example/issues/1234/hovercard">this issue</a>.</p>`,
			],
		])(
			"does not report for a closing keyword on an issue in a pull request into a non-default branch: %s",
			async (_, bodyHTML) => {
				const report = await testBodyHTML(bodyHTML);

				expect(report).not.toHaveBeenCalled();
			},
		);

		it.each([
			[
				"fixes #123, for a nonexistent issue",
				`<li class="task-list-item"><input type="checkbox" id="" disabled="" class="task-list-item-checkbox" aria-label="Incomplete task"> Addresses an existing open issue: fixes #123</li>`,
			],
			[
				"Closes #123, for a pull request",
				`<p dir="auto"><span class="issue-keyword" aria-label="This pull request closes pull request #123.">Closes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5104737980" data-permission-text="Title is private" data-url="https://github.com/organization/repository/issues/456" data-hovercard-type="pull_request" data-hovercard-url="/organization/repository/pull/456/hovercard" href="https://github.com/organization/repository/pull/456">#123</a></p>`,
			],
			[
				"Fixes example/example-projects#5, for an issue that can't be seen",
				`<p dir="auto"><span class="issue-keyword" aria-label="This pull request closes issue #5.">Fixes</span> example/example-projects#5</p>`,
			],
			[
				"Fixes [example-repository Issue 123](https://github.com/example-organization/example-repository/issues/123), for an issue that can't be seen",
				`<li><span class="issue-keyword" aria-label="This pull request closes issue #123.">Fixes</span> <a href="https://github.com/example-organization/example-repository/issues/123">example-repository Issue 123</a></li>`,
			],
			[
				"**Closes:** #1234, with emphasis",
				`<p dir="auto"><strong>Closes:</strong> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5538367850" data-permission-text="Title is private" data-url="https://github.com/example/example/issues/1234" data-hovercard-type="issue" data-hovercard-url="/example/example/issues/1234/hovercard" href="https://github.com/example/example/issues/1234">#1234</a></p>`,
			],
			[
				"`Fixes #1234`, in inline code",
				`<li><a href="https://github.com/example/example/pull/1986" data-hovercard-type="pull_request" data-hovercard-url="/example/example/pull/1986/hovercard">#1986</a> sticky agent profile (<code class="notranslate">Fixes #1234</code>)</li>`,
			],
			[
				"Closes #123, in a code block",
				`<div class="snippet-clipboard-content notranslate position-relative overflow-auto" data-snippet-clipboard-copy-content="release: 8 packages\n\nCloses #123"><pre lang="proposed-squash-commit" class="notranslate"><code class="notranslate">release: 8 packages\n\nCloses #123\n</code></pre></div>`,
			],
		])(
			"reports for a closing keyword not on an issue in a pull request into a non-default branch: %s",
			async (_, bodyHTML) => {
				const report = await testBodyHTML(bodyHTML);

				expect(report).toHaveBeenCalled();
			},
		);

		it.each([
			["without base branch information", {}],
			["without base repository information", { base: { ref: "feature" } }],
			[
				"into the default branch",
				{ base: { ref: "main", repo: { default_branch: "main" } } },
			],
		])(
			"reports for a closing keyword on an issue in a pull request %s",
			async (_, data) => {
				const report = await testBodyHTML(closesIssue, data);

				expect(report).toHaveBeenCalled();
			},
		);
	});
});
