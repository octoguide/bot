import { Octokit } from "octokit";
import { describe, expect, it } from "vitest";

import { createActor } from "./createActor";
import { DiscussionActor } from "./DiscussionActor";
import { DiscussionCommentActor } from "./DiscussionCommentActor";
import { IssueLikeActor } from "./IssueLikeActor";
import { IssueLikeCommentActor } from "./IssueLikeCommentActor";

const mockOctokit = {} as Octokit;

describe(createActor, () => {
	it("returns no actor when given a URL with no reasonable locator", () => {
		const url = "https://example.com";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeUndefined();
	});

	it("returns no actor when given a URL for a non-resolvable entity", () => {
		const url = "https://github.com/owner/repository";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeUndefined();
	});

	it("creates a DiscussionCommentActor when given a discussion comment URL", () => {
		const url =
			"https://github.com/owner/repository/discussions/123#discussioncomment-456";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeInstanceOf(DiscussionCommentActor);
	});

	it("creates a DiscussionActor when given a discussion URL", () => {
		const url = "https://github.com/owner/repository/discussions/123";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeInstanceOf(DiscussionActor);
	});

	it("creates an IssueLikeCommentActor when given an issue comment URL", () => {
		const url =
			"https://github.com/owner/repository/issues/123#issuecomment-456";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeInstanceOf(IssueLikeCommentActor);
	});

	it("creates an IssueLikeActor when given an issue URL", () => {
		const url = "https://github.com/owner/repository/issues/123";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeInstanceOf(IssueLikeActor);
	});

	it("creates an IssueLikeCommentActor when given a pull request comment URL", () => {
		const url = "https://github.com/owner/repository/pull/123#issuecomment-456";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeInstanceOf(IssueLikeCommentActor);
	});

	it("creates an IssueLikeActor when given a pull request URL", () => {
		const url = "https://github.com/owner/repository/pull/123";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeInstanceOf(IssueLikeActor);
	});
});
