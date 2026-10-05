import { describe, expect, it, vi } from "vitest";

import { createMockOctokit } from "../tests/createMockOctokit.ts";
import { createActor } from "./createActor.ts";
import { DiscussionActor } from "./DiscussionActor.ts";
import { DiscussionCommentActor } from "./DiscussionCommentActor.ts";
import { IssueActor } from "./IssueActor.ts";
import { IssueLikeCommentActor } from "./IssueLikeCommentActor.ts";
import { PullRequestActor } from "./PullRequestActor.ts";

vi.mock("octokit-from-auth", () => ({
	octokitFromAuth: () => Promise.resolve(createMockOctokit()),
}));

describe(createActor, () => {
	it("returns no actor when given a URL with no reasonable locator", async () => {
		const url = "https://example.com";

		const { actor } = await createActor({ url });

		expect(actor).toBeUndefined();
	});

	it("returns no actor when given a URL for a non-resolvable entity", async () => {
		const url = "https://github.com/owner/repository";

		const { actor } = await createActor({ url });

		expect(actor).toBeUndefined();
	});

	it("creates a DiscussionCommentActor when given a discussion comment URL", async () => {
		const url =
			"https://github.com/owner/repository/discussions/123#discussioncomment-456";

		const { actor } = await createActor({ url });

		expect(actor).toBeInstanceOf(DiscussionCommentActor);
	});

	it("creates a DiscussionActor when given a discussion URL", async () => {
		const url = "https://github.com/owner/repository/discussions/123";

		const { actor } = await createActor({ url });

		expect(actor).toBeInstanceOf(DiscussionActor);
	});

	it("creates an IssueLikeCommentActor when given an issue comment URL", async () => {
		const url =
			"https://github.com/owner/repository/issues/123#issuecomment-456";

		const { actor } = await createActor({ url });

		expect(actor).toBeInstanceOf(IssueLikeCommentActor);
	});

	it("creates an IssueActor when given an issue URL", async () => {
		const url = "https://github.com/owner/repository/issues/123";

		const { actor } = await createActor({ url });

		expect(actor).toBeInstanceOf(IssueActor);
	});

	it("creates an IssueLikeCommentActor when given a pull request comment URL", async () => {
		const url = "https://github.com/owner/repository/pull/123#issuecomment-456";

		const { actor } = await createActor({ url });

		expect(actor).toBeInstanceOf(IssueLikeCommentActor);
	});

	it("creates a PullRequestActor when given a pull request URL", async () => {
		const url = "https://github.com/owner/repository/pull/123";

		const { actor } = await createActor({ url });

		expect(actor).toBeInstanceOf(PullRequestActor);
	});
});
