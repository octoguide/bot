import { Octokit } from "octokit";
import { describe, expect, it } from "vitest";

import { createActor } from "./createActor";
import { DiscussionActor } from "./DiscussionActor";
import { DiscussionCommentActor } from "./DiscussionCommentActor";
import { IssueLikeActor } from "./IssueLikeActor";
import { IssueLikeCommentActor } from "./IssueLikeCommentActor";

const mockOctokit = {} as Octokit;

describe(createActor, () => {
	it("creates a DiscussionCommentActor when given a discussion comment URL", () => {
		const url = "discussions/123#discussioncomment-456";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeInstanceOf(DiscussionCommentActor);
	});

	it("creates a DiscussionActor when given a discussion URL", () => {
		const url = "discussions/123";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeInstanceOf(DiscussionActor);
	});

	it("creates an IssueLikeCommentActor when given an issue comment URL", () => {
		const url = "issues/123#issuecomment-456";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeInstanceOf(IssueLikeCommentActor);
	});

	it("creates an IssueLikeActor when given an issue URL", () => {
		const url = "issues/123";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeInstanceOf(IssueLikeActor);
	});

	it("creates an IssueLikeCommentActor when given a pull request comment URL", () => {
		const url = "pull/123#issuecomment-456";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeInstanceOf(IssueLikeCommentActor);
	});

	it("creates an IssueLikeActor when given a pull request URL", () => {
		const url = "pull/123";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeInstanceOf(IssueLikeActor);
	});

	it("returns no actor when given an invalid URL", () => {
		const url = "invalid/url";

		const { actor } = createActor(mockOctokit, url);

		expect(actor).toBeUndefined();
	});
});
