import type * as github from "@actions/github";

import * as core from "@actions/core";

import type { CommentData } from "../types/entities.js";
import type { LocatedOctokit } from "../types/octokit.js";

import { createActor } from "../actors/createActor.js";
import { getExistingComment } from "./comments/getExistingComment.js";
import { isRequestError } from "./comments/isRequestError.js";

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

	try {
		await deleteExistingComment(existingComment, octokit, payload);
	} catch (error) {
		if (!isAlreadyDeletedError(error)) {
			throw error;
		}

		core.info("Existing comment was already deleted. Nothing to clean up.");
	}
}

async function deleteExistingComment(
	existingComment: CommentData,
	octokit: LocatedOctokit,
	payload: typeof github.context.payload,
) {
	if (payload.discussion) {
		core.info(
			`Deleting discussion comment with node id: ${existingComment.node_id}`,
		);
		await octokit.graphql(
			`
				mutation($id: ID!) {
					deleteDiscussionComment(input: { id: $id }) {
						comment {
							id
						}
					}
				}
			`,
			{
				id: existingComment.node_id,
			},
		);
	} else {
		core.info(`Deleting issue-like comment with id: ${existingComment.id}`);
		await octokit.rest.issues.deleteComment({
			comment_id: existingComment.id,
		});
	}
}

function isAlreadyDeletedError(error: unknown) {
	if (isRequestError(error)) {
		return error.status === 404;
	}

	return (
		error instanceof Error &&
		"errors" in error &&
		Array.isArray(error.errors) &&
		error.errors.some(
			(graphqlError: { type?: string }) => graphqlError.type === "NOT_FOUND",
		)
	);
}
