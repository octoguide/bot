import type { Octokit } from "octokit";

import type { LocatedOctokit } from "../types/octokit.js";

import { DiscussionActor } from "./DiscussionActor.js";
import { DiscussionCommentActor } from "./DiscussionCommentActor.js";
import { IssueActor } from "./IssueActor.js";
import { IssueLikeCommentActor } from "./IssueLikeCommentActor.js";
import { locateOctokit } from "./locateOctokit.js";
import { parseCommentId, parseEntityUrl } from "./parseEntity.js";
import { parseLocator } from "./parseLocator.js";
import { PullRequestActor } from "./PullRequestActor.js";

/**
 * Resolves the actor, repository locator, and repository-scoped Octokit for a URL.
 * @remarks Repository-scopes the provided Octokit in place, per {@link locateOctokit}.
 */
export function createActor(octokit: Octokit, url: string) {
	const locator = parseLocator(url);
	if (!locator) {
		return {};
	}

	locateOctokit(octokit, locator);

	const locatedOctokit: LocatedOctokit = octokit;

	const matches = parseEntityUrl(url);
	if (!matches) {
		return { locator, octokit: locatedOctokit };
	}

	const [urlType, parentNumber] = matches;

	const commentId = parseCommentId(url);

	const actor = (() => {
		switch (urlType) {
			case "discussions":
				return commentId
					? new DiscussionCommentActor(+commentId, +parentNumber, octokit)
					: new DiscussionActor(+parentNumber, locatedOctokit);

			case "issues":
			case "pull": {
				const parentType = urlType === "issues" ? "issue" : "pull_request";
				if (commentId) {
					return new IssueLikeCommentActor(
						+commentId,
						locatedOctokit,
						+parentNumber,
						parentType,
					);
				}

				return parentType === "issue"
					? new IssueActor(+parentNumber, parentType, locatedOctokit)
					: new PullRequestActor(+parentNumber, parentType, locatedOctokit);
			}
		}
	})();

	return { actor, locator, octokit: locatedOctokit };
}
