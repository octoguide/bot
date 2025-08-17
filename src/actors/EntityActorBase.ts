import type { Octokit } from "octokit";

import * as core from "@actions/core";

import type { RepositoryLocator } from "../types/data.js";
import type { CommentData, Entity, EntityData } from "../types/entities.js";
import type { EntityActor } from "./types.js";

/**
 * Response type for the minimizeComment GraphQL mutation.
 */
interface MinimizeCommentResponse {
	minimizeComment: {
		minimizedComment: {
			isMinimized: boolean;
		};
	};
}

/**
 * Response type for the unminimizeComment GraphQL mutation.
 */
interface UnminimizeCommentResponse {
	unminimizeComment: {
		unminimizedComment: {
			isMinimized: boolean;
		};
	};
}

export abstract class EntityActorBase<Data extends EntityData>
	implements EntityActor<Data>
{
	abstract readonly metadata: Omit<Entity, "data">;

	protected entityNumber: number;
	protected locator: RepositoryLocator;
	protected octokit: Octokit;

	constructor(
		entityNumber: number,
		locator: RepositoryLocator,
		octokit: Octokit,
	) {
		this.entityNumber = entityNumber;
		this.locator = locator;
		this.octokit = octokit;
	}

	abstract createComment(body: string): Promise<string>;
	abstract listComments(): Promise<CommentData[]>;
	abstract updateComment(number: number, newBody: string): Promise<void>;

	// TODO: It would be cleaner & faster to get this from the action event...
	// https://github.com/JoshuaKGoldberg/OctoGuide/issues/85
	abstract getData(): Promise<Data>;

	/**
	 * Minimizes a comment using GitHub's GraphQL API.
	 * @param nodeId The GraphQL node ID of the comment to minimize
	 * @param reason The reason for minimizing the comment (defaults to "RESOLVED")
	 * @returns Promise that resolves to true if the comment was successfully minimized, false otherwise
	 */
	async minimizeComment(
		nodeId: string,
		reason: "RESOLVED" = "RESOLVED",
	): Promise<boolean> {
		try {
			const response = await this.octokit.graphql<MinimizeCommentResponse>(
				`mutation($commentId: ID!, $reason: ReportedContentClassifiers!) {
					minimizeComment(input: {subjectId: $commentId, classifier: $reason}) {
						minimizedComment { 
							isMinimized 
						}
					}
				}`,
				{ commentId: nodeId, reason },
			);

			return response.minimizeComment.minimizedComment.isMinimized;
		} catch (error) {
			// Log for debugging but don't throw - let calling code handle the false return
			core.debug(`Failed to minimize comment ${nodeId}: ${String(error)}`);
			return false;
		}
	}

	/**
	 * Unminimize a comment using GitHub's GraphQL API.
	 * @param nodeId The GraphQL node ID of the comment to unminimize
	 * @returns Promise that resolves to true if the comment was successfully unminimized, false otherwise
	 */
	async unminimizeComment(nodeId: string): Promise<boolean> {
		try {
			const response = await this.octokit.graphql<UnminimizeCommentResponse>(
				`mutation($commentId: ID!) {
					unminimizeComment(input: {subjectId: $commentId}) {
						unminimizedComment { 
							isMinimized 
						}
					}
				}`,
				{ commentId: nodeId },
			);

			// Return true if successfully unminimized (isMinimized should be false)
			return !response.unminimizeComment.unminimizedComment.isMinimized;
		} catch (error) {
			// Log for debugging but don't throw - let calling code handle the false return
			core.debug(`Failed to unminimize comment ${nodeId}: ${String(error)}`);
			return false;
		}
	}
}
