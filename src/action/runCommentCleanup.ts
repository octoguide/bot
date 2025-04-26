import type * as github from "@actions/github";
import type { Octokit } from "octokit";

import * as core from "@actions/core";

import { createActor } from "../actors/createActor";
import { getExistingComment } from "./comments/getExistingComment";

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
		await octokit.rest.issues.deleteComment({
			comment_id: existingComment.id,
			owner: locator.owner,
			repo: locator.repository,
		});
	}
}
