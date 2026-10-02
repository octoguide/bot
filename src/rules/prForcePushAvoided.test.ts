import type { Octokit } from "octokit";

import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { prForcePushAvoided } from "./prForcePushAvoided.js";

const headSha = "abc123";

async function testWithTimeline(
	reviewedAt: string | undefined,
	forcePush: undefined | { afterCommit: { oid: string }; createdAt: string },
) {
	const report = vi.fn();

	await testRule(
		prForcePushAvoided,
		{
			data: {
				head: {
					sha: headSha,
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
							reviews: {
								nodes: reviewedAt ? [{ submittedAt: reviewedAt }] : [],
							},
							timelineItems: {
								nodes: forcePush ? [forcePush] : [],
							},
						},
					},
				}) as unknown as Octokit["graphql"],
			},
			report,
		},
	);

	return report;
}

describe(prForcePushAvoided.about.name, () => {
	it("does not report when the pull request has not been reviewed", async () => {
		const report = await testWithTimeline(undefined, {
			afterCommit: { oid: headSha },
			createdAt: "2026-01-02T00:00:00Z",
		});

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request has been reviewed but not force-pushed", async () => {
		const report = await testWithTimeline("2026-01-01T00:00:00Z", undefined);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request was force-pushed before it was reviewed", async () => {
		const report = await testWithTimeline("2026-01-02T00:00:00Z", {
			afterCommit: { oid: headSha },
			createdAt: "2026-01-01T00:00:00Z",
		});

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request was pushed to normally after a force-push", async () => {
		const report = await testWithTimeline("2026-01-01T00:00:00Z", {
			afterCommit: { oid: "def456" },
			createdAt: "2026-01-02T00:00:00Z",
		});

		expect(report).not.toHaveBeenCalled();
	});

	it("reports when the pull request's latest changes were force-pushed after it was reviewed", async () => {
		const report = await testWithTimeline("2026-01-01T00:00:00Z", {
			afterCommit: { oid: headSha },
			createdAt: "2026-01-02T00:00:00Z",
		});

		expect(report).toHaveBeenCalledWith({
			primary:
				"This pull request's latest changes were force-pushed after it was reviewed.",
			suggestion: [
				"To resolve this report, push any further changes as new commits rather than force-pushing.",
				"There's no need to rewrite existing commits to keep them clean.",
			],
		});
	});
});
