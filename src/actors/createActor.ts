import type { Octokit } from "octokit";

import { DiscussionActor } from "./DiscussionActor.js";
import { DiscussionCommentActor } from "./DiscussionCommentActor.js";
import { IssueLikeActor } from "./IssueLikeActor.js";
import { IssueLikeCommentActor } from "./IssueLikeCommentActor.js";
import { parseLocator } from "./parseLocator.js";

export function createActor(octokit: Octokit, url: string) {
	const locator = parseLocator(url);
	if (!locator) {
		throw new Error("Could not resolve GitHub entity locator.");
	}

	const matches = /(discussions|issues|pull)\/(\d+)/.exec(url);
	if (!matches) {
		throw new Error("Could not resolve GitHub url type.");
	}

	const [, urlType, parentNumber] = matches;

	const commentNumber = /#(?:discussion|issue)comment-(\d+)/.exec(url)?.[1];

	const actor = (() => {
		switch (urlType) {
			case "discussions":
				return commentNumber
					? new DiscussionCommentActor(
							+commentNumber,
							+parentNumber,
							locator,
							octokit,
						)
					: new DiscussionActor(+parentNumber, locator, octokit);

			case "issues":
			case "pull": {
				const parentType = urlType === "issues" ? "issue" : "pull_request";
				return commentNumber
					? new IssueLikeCommentActor(
							+commentNumber,
							locator,
							octokit,
							+parentNumber,
							parentType,
						)
					: new IssueLikeActor(+parentNumber, parentType, locator, octokit);
			}
		}
	})();

	return { actor, locator };
}
