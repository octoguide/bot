import type { Octokit } from "octokit";

import type { EntityActor } from "./types.js";

import { RepositoryLocator } from "../types/data.js";
import { DiscussionActor } from "./DiscussionActor.js";
import { DiscussionCommentActor } from "./DiscussionCommentActor.js";
import { IssueLikeActor } from "./IssueLikeActor.js";
import { IssueLikeCommentActor } from "./IssueLikeCommentActor.js";

export function actorFactory(
	locator: RepositoryLocator,
	octokit: Octokit,
	url: string,
): EntityActor | undefined {
	const matches = /(discussions|issues|pull)\/(\d+)/.exec(url);
	if (!matches) {
		return undefined;
	}

	const [, urlType, parentNumber] = matches;

	const commentId = /#(?:discussion|issue)comment-(\d+)/.exec(url)?.[1];

	switch (urlType) {
		case "discussions":
			return commentId
				? new DiscussionCommentActor(
						+commentId,
						+parentNumber,
						locator,
						octokit,
					)
				: new DiscussionActor(+parentNumber, locator, octokit);

		case "issues":
		case "pull": {
			const parentType = urlType === "issues" ? "issue" : "pull_request";
			return commentId
				? new IssueLikeCommentActor(
						+commentId,
						locator,
						octokit,
						+parentNumber,
						parentType,
					)
				: new IssueLikeActor(+parentNumber, parentType, locator, octokit);
		}
	}
}
