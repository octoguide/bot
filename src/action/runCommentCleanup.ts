import type * as github from "@actions/github";

import * as core from "@actions/core";

import { createActor } from "../actors/createActor.js";
import { getExistingComment } from "./comments/getExistingComment.js";

export interface RunCommentCleanupSettings {
	auth: string;
	payload: typeof github.context.payload;
	url: string;
}

export async function runCommentCleanup({
	auth,
	payload,
	url,
}: RunCommentCleanupSettings) {
	if (!payload.comment) {
		return;
	}

	const { actor, octokit } = await createActor({ auth, url });
	if (!actor) {
		throw new Error("Could not resolve GitHub entity actor.");
	}

	const existingComment = await getExistingComment(actor, url);
	if (!existingComment) {
		core.info("No existing comment found. Nothing to clean up.");
		return;
	}

	if (payload.discussion) {
		core.info(
			`Deleting discussion comment with node id: ${existingComment.node_id}`,
		);
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
				commentId: existingComment.node_id,
			},
		);
	} else {
		core.info(`Deleting issue-like comment with id: ${existingComment.id}`);
		await octokit.rest.issues.deleteComment({
			comment_id: existingComment.id,
		});
	}
}
