import { createLocatedOctokit } from "./createLocatedOctokit.js";
import { DiscussionActor } from "./DiscussionActor.js";
import { DiscussionCommentActor } from "./DiscussionCommentActor.js";
import { IssueActor } from "./IssueActor.js";
import { IssueLikeCommentActor } from "./IssueLikeCommentActor.js";
import { parseCommentId, parseEntityUrl } from "./parseEntity.js";
import { parseLocator } from "./parseLocator.js";
import { PullRequestActor } from "./PullRequestActor.js";

export interface CreateActorSettings {
	auth?: string;
	url: string;
}

/**
 * Resolves the actor, repository locator, and repository-scoped Octokit for a URL.
 */
export async function createActor({ auth, url }: CreateActorSettings) {
	const locator = parseLocator(url);
	if (!locator) {
		return {};
	}

	const octokit = await createLocatedOctokit(locator, { auth });

	const matches = parseEntityUrl(url);
	if (!matches) {
		return { locator, octokit };
	}

	const [urlType, parentNumber] = matches;

	const commentId = parseCommentId(url);

	const actor = (() => {
		switch (urlType) {
			case "discussions":
				return commentId
					? new DiscussionCommentActor(+commentId, +parentNumber, octokit)
					: new DiscussionActor(+parentNumber, octokit);

			case "issues":
			case "pull": {
				const parentType = urlType === "issues" ? "issue" : "pull_request";
				if (commentId) {
					return new IssueLikeCommentActor(
						+commentId,
						octokit,
						+parentNumber,
						parentType,
					);
				}

				return parentType === "issue"
					? new IssueActor(+parentNumber, parentType, octokit)
					: new PullRequestActor(+parentNumber, parentType, octokit);
			}
		}
	})();

	return { actor, locator, octokit };
}
