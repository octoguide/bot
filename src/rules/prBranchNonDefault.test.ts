import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { prBranchNonDefault } from "./prBranchNonDefault.js";

const get = vi.fn().mockResolvedValue({
	data: {
		default_branch: "main",
	},
});

describe(prBranchNonDefault.about.name, () => {
	it("does not report when the pull request has a different head than the default branch", async () => {
		const report = vi.fn();

		await testRule(
			prBranchNonDefault,
			{
				data: {
					head: {
						ref: "patch-1",
					},
				},
				type: "pull_request",
			},
			{
				octokit: {
					rest: {
						repos: { get },
					},
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("reports when the pull request has the same head as the default branch", async () => {
		const report = vi.fn();

		await testRule(
			prBranchNonDefault,
			{
				data: {
					head: {
						ref: "main",
					},
				},
				type: "pull_request",
			},
			{
				octokit: {
					rest: {
						repos: { get },
					},
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledWith({
			primary: "This PR is sent from the head repository's default branch",
			secondary: [
				`Sending a PR from a default branch means the head repository can't easily be updated after the PR is merged.`,
			],
			suggestion: [
				"You'll need to:",
				"1. Create a new branch on your fork",
				"2. Send a new pull request from that branch",
				"3. Close this pull request",
			],
		});
	});
});
