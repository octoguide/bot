import { createLocatedOctokit } from "./createLocatedOctokit.ts";
import { DiscussionActor } from "./DiscussionActor.ts";
import { DiscussionCommentActor } from "./DiscussionCommentActor.ts";
import { IssueActor } from "./IssueActor.ts";
import { IssueLikeCommentActor } from "./IssueLikeCommentActor.ts";
import { parseCommentId, parseEntityUrl } from "./parseEntity.ts";
import { parseLocator } from "./parseLocator.ts";
import { PullRequestActor } from "./PullRequestActor.ts";

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
