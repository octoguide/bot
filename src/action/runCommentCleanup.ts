import type * as github from "@actions/github";
import type { Octokit } from "octokit";

import { parseLocator } from "../actors/parseLocator.js";

export interface RunCommentCleanupSettings {
	octokit: Octokit;
	payload: typeof github.context.payload;
	url: string;
}

export async function runCommentCleanup({
	octokit,
	payload,
	url,
}: RunCommentCleanupSettings) {
	if (!payload.comment) {
		return;
	}

	const locator = parseLocator(url);
	if (!locator) {
		throw new Error("Could not resolve GitHub entity locator.");
	}

	if (payload.discussion) {
		await octokit.graphql(
			`
                mutation($body: String!, $commentId: ID!) {
                    deleteDiscussionComment(input: {
                        body: $body,
                        commentId: $commentId
                    }) {
                        comment {
                            id
                        }
                    }
                }
            `,
			{
				commentId: payload.comment.node_id,
			},
		);
	} else {
		await octokit.rest.issues.deleteComment({
			comment_id: payload.comment.id,
			owner: locator.owner,
			repo: locator.repository,
		});
	}
}
