import type { Octokit } from "octokit";

import { DiscussionActor } from "./DiscussionActor.js";
import { DiscussionCommentActor } from "./DiscussionCommentActor.js";
import { IssueActor } from "./IssueActor.js";
import { IssueLikeCommentActor } from "./IssueLikeCommentActor.js";
import { parseEntityUrl } from "./parseEntityUrl.js";
import { parseLocator } from "./parseLocator.js";
import { PullRequestActor } from "./PullRequestActor.js";

export function createActor(octokit: Octokit, url: string) {
	const locator = parseLocator(url);
	if (!locator) {
		return {};
	}

	const matches = parseEntityUrl(url);
	if (!matches) {
		return { locator };
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
				if (commentNumber) {
					return new IssueLikeCommentActor(
						+commentNumber,
						locator,
						octokit,
						+parentNumber,
						parentType,
					);
				}

				return parentType === "issue"
					? new IssueActor(+parentNumber, parentType, locator, octokit)
					: new PullRequestActor(+parentNumber, parentType, locator, octokit);
			}
		}
	})();

	return { actor, locator };
}
