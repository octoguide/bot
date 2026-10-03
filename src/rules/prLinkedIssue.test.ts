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
		// cspell:ignore celestia celestiaorg documentatie fritzprix harkinian keploy libr mezmo obug tinyforks tooltipped
		const closesIssue = `<p dir="auto"><span class="issue-keyword">closes</span>: <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5642943017" data-permission-text="Title is private" data-url="https://github.com/nl-design-system/documentatie/issues/4744" data-hovercard-type="issue" data-hovercard-url="/nl-design-system/documentatie/issues/4744/hovercard" href="https://github.com/nl-design-system/documentatie/issues/4744">#4744</a></p>`;

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
				`<li class="task-list-item"><input type="checkbox" id="" disabled="" class="task-list-item-checkbox" aria-label="Completed task" checked=""> Addresses an existing open issue: <span class="issue-keyword">fixes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5539994529" data-permission-text="Title is private" data-url="https://github.com/tinyforks/obug-for-file/issues/3" data-hovercard-type="issue" data-hovercard-url="/tinyforks/obug-for-file/issues/3/hovercard" href="https://github.com/tinyforks/obug-for-file/issues/3">#3</a></li>`,
			],
			["closes: #4744", closesIssue],
			[
				"Fixes: GH-721",
				`<p dir="auto"><span class="issue-keyword">Fixes</span>: <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5574482310" data-permission-text="Title is private" data-url="https://github.com/mezmo/aura/issues/721" data-hovercard-type="issue" data-hovercard-url="/mezmo/aura/issues/721/hovercard" href="https://github.com/mezmo/aura/issues/721">GH-721</a></p>`,
			],
			[
				"Fixes celestiaorg/celestia-app#8037",
				`<p dir="auto"><span class="issue-keyword">Fixes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5653515580" data-permission-text="Title is private" data-url="https://github.com/celestiaorg/celestia-app/issues/8037" data-hovercard-type="issue" data-hovercard-url="/celestiaorg/celestia-app/issues/8037/hovercard" href="https://github.com/celestiaorg/celestia-app/issues/8037">celestiaorg/celestia-app#8037</a></p>`,
			],
			[
				"Fixes #1234 in a fork, for its parent repository's issue",
				`<p dir="auto">Link related issues: "<span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #1234.">Fixes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="275232423" data-permission-text="Title is private" data-url="https://github.com/ray-project/ray/issues/1234" data-hovercard-type="issue" data-hovercard-url="/ray-project/ray/issues/1234/hovercard" href="https://github.com/ray-project/ray/issues/1234">ray-project#1234</a>"</p>`,
			],
			[
				"fixes [this issue](https://github.com/2ship2harkinian/2ship2harkinian/issues/1961)",
				`<p dir="auto">This <span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #1961.">fixes</span> <a href="https://github.com/2ship2harkinian/2ship2harkinian/issues/1961" data-hovercard-type="issue" data-hovercard-url="/2ship2harkinian/2ship2harkinian/issues/1961/hovercard">this issue</a>.</p>`,
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
				"fixes #000, for a nonexistent issue",
				`<li class="task-list-item"><input type="checkbox" id="" disabled="" class="task-list-item-checkbox" aria-label="Incomplete task"> Addresses an existing open issue: fixes #000</li>`,
			],
			[
				"Closes #253, for a pull request",
				`<p dir="auto"><span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes pull request #253.">Closes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5104737980" data-permission-text="Title is private" data-url="https://github.com/cds-hooks/sandbox/issues/253" data-hovercard-type="pull_request" data-hovercard-url="/cds-hooks/sandbox/pull/253/hovercard" href="https://github.com/cds-hooks/sandbox/pull/253">#253</a></p>`,
			],
			[
				"Fixes cvc5/cvc5-projects#5, for an issue that can't be seen",
				`<p dir="auto"><span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #5.">Fixes</span> cvc5/cvc5-projects#5</p>`,
			],
			[
				"Fixes [DTT Issue 735](https://github.com/onvif/dtt/issues/735), for an issue that can't be seen",
				`<li><span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #735.">Fixes</span> <a href="https://github.com/onvif/dtt/issues/735">DTT Issue 735</a></li>`,
			],
			[
				"**Closes:** #4630, with emphasis",
				`<p dir="auto"><strong>Closes:</strong> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5538367850" data-permission-text="Title is private" data-url="https://github.com/keploy/keploy/issues/4630" data-hovercard-type="issue" data-hovercard-url="/keploy/keploy/issues/4630/hovercard" href="https://github.com/keploy/keploy/issues/4630">#4630</a></p>`,
			],
			[
				"`Fixes #1984`, in inline code",
				`<li><a href="https://github.com/fritzprix/libr-agent/pull/1986" data-hovercard-type="pull_request" data-hovercard-url="/fritzprix/libr-agent/pull/1986/hovercard">#1986</a> sticky agent profile (<code class="notranslate">Fixes #1984</code>)</li>`,
			],
			[
				"Closes #238, in a code block",
				`<div class="snippet-clipboard-content notranslate position-relative overflow-auto" data-snippet-clipboard-copy-content="release: 8 packages\n\nCloses #238"><pre lang="proposed-squash-commit" class="notranslate"><code class="notranslate">release: 8 packages\n\nCloses #238\n</code></pre></div>`,
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
