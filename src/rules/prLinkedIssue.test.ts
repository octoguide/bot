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
					}),
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
					}),
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
					body: "fixes: https://github.com/JoshuaKGoldberg/OctoGuide/security/dependabot/85",
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
					}),
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});
});
