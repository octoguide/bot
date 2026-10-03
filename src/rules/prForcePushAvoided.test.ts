import type { Octokit } from "octokit";

import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { prForcePushAvoided } from "./prForcePushAvoided.js";

const authorLogin = "contributor";
const headSha = "abc123";

interface TestForcePush {
	actor: null | { login: string };
	afterCommit: null | { oid: string };
	createdAt: string;
}

interface TestReview {
	author: null | { __typename: string; login: string };
	submittedAt: null | string;
}

function createForcePush(
	createdAt: string,
	overrides: Partial<TestForcePush> = {},
): TestForcePush {
	return {
		actor: { login: authorLogin },
		afterCommit: { oid: headSha },
		createdAt,
		...overrides,
	};
}

function createReview(
	submittedAt: string,
	login = "maintainer",
	__typename = "User",
): TestReview {
	return { author: { __typename, login }, submittedAt };
}

async function testWithTimeline(
	reviews: TestReview[],
	forcePush: TestForcePush | undefined,
) {
	const graphql = vi.fn().mockResolvedValue({
		repository: {
			pullRequest: {
				reviews: {
					nodes: reviews,
				},
				timelineItems: {
					nodes: forcePush ? [forcePush] : [],
				},
			},
		},
	});
	const report = vi.fn();

	await testRule(
		prForcePushAvoided,
		{
			data: {
				head: {
					sha: headSha,
				},
				user: {
					login: authorLogin,
				},
			},
			number: 2,
			type: "pull_request",
		},
		{
			octokit: {
				graphql: graphql as unknown as Octokit["graphql"],
			},
			report,
		},
	);

	return { graphql, report };
}

describe(prForcePushAvoided.about.name, () => {
	it("does not report when the pull request has not been reviewed", async () => {
		const { report } = await testWithTimeline(
			[],
			createForcePush("2026-01-02T00:00:00Z"),
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request has been reviewed but not force-pushed", async () => {
		const { report } = await testWithTimeline(
			[createReview("2026-01-01T00:00:00Z")],
			undefined,
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request was force-pushed before it was reviewed", async () => {
		const { report } = await testWithTimeline(
			[createReview("2026-01-02T00:00:00Z")],
			createForcePush("2026-01-01T00:00:00Z"),
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request was pushed to normally after a force-push", async () => {
		const { report } = await testWithTimeline(
			[createReview("2026-01-01T00:00:00Z")],
			createForcePush("2026-01-02T00:00:00Z", {
				afterCommit: { oid: "def456" },
			}),
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the force-push's resulting commit is unknown", async () => {
		const { report } = await testWithTimeline(
			[createReview("2026-01-01T00:00:00Z")],
			createForcePush("2026-01-02T00:00:00Z", { afterCommit: null }),
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request was force-pushed by someone other than its author", async () => {
		const { report } = await testWithTimeline(
			[createReview("2026-01-01T00:00:00Z")],
			createForcePush("2026-01-02T00:00:00Z", {
				actor: { login: "maintainer" },
			}),
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request was only reviewed by bots and its author", async () => {
		const { report } = await testWithTimeline(
			[
				createReview(
					"2026-01-01T00:00:00Z",
					"copilot-pull-request-reviewer",
					"Bot",
				),
				createReview("2026-01-01T00:00:00Z", authorLogin),
			],
			createForcePush("2026-01-02T00:00:00Z"),
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request was force-pushed after a bot review but before a human review", async () => {
		const { report } = await testWithTimeline(
			[
				createReview(
					"2026-01-01T00:00:00Z",
					"copilot-pull-request-reviewer",
					"Bot",
				),
				createReview("2026-01-03T00:00:00Z"),
			],
			createForcePush("2026-01-02T00:00:00Z"),
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("reports when the pull request was force-pushed by its author after a human review", async () => {
		const { graphql, report } = await testWithTimeline(
			[
				createReview("2026-01-01T00:00:00Z", "github-actions", "Bot"),
				createReview("2026-01-01T00:00:00Z", authorLogin),
				createReview("2026-01-02T00:00:00Z"),
			],
			createForcePush("2026-01-03T00:00:00Z"),
		);

		expect(graphql).toHaveBeenCalledWith(expect.any(String), { id: 2 });
		expect(report).toHaveBeenCalledWith({
			primary:
				"This pull request's latest changes were force-pushed after it was reviewed.",
			suggestion: [
				"To resolve this report, push any further changes as new commits rather than force-pushing.",
				"There's no need to rewrite existing commits to keep them clean.",
				"If you need to resolve conflicts, merge the base branch in instead of rebasing onto it.",
			],
		});
	});

	it("reports when the earliest human review is listed after a later one", async () => {
		const { report } = await testWithTimeline(
			[
				createReview("2026-01-03T00:00:00Z"),
				createReview("2026-01-01T00:00:00Z", "other-maintainer"),
			],
			createForcePush("2026-01-02T00:00:00Z"),
		);

		expect(report).toHaveBeenCalledOnce();
	});
});
