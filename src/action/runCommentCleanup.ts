import type * as github from "@actions/github";

import * as core from "@actions/core";
import { octokitFromAuth } from "octokit-from-auth";

import { createActor } from "../actors/createActor";
import { getExistingComment } from "./comments/getExistingComment";

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

	const octokit = await octokitFromAuth({ auth });
	const { actor, locator } = createActor(octokit, url);
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
			`Deleting discussion comment with node ID: ${existingComment.node_id}`,
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
		core.info(
			`Deleting issue comment with id: ${existingComment.id.toString()}`,
		);
		await octokit.rest.issues.deleteComment({
			comment_id: existingComment.id,
			owner: locator.owner,
			repo: locator.repository,
		});
	}
}
