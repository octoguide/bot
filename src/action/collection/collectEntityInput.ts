import type * as github from "@actions/github";

import { parseCommentId, parseEntityUrl } from "../../actors/parseEntity";
import {
	CommentEntity,
	DiscussionEntity,
	Entity,
	EntityData,
	IssueEntity,
	PullRequestEntity,
} from "../../types/entities";

export function collectEntityInput(
	payload: (typeof github.context)["payload"],
	target: EntityData,
	url: string,
) {
	const matches = parseEntityUrl(url);
	if (!matches) {
		throw new Error(`Could not determine entity type from URL: ${url}`);
	}

	const [urlType, urlNumberStr] = matches;
	const urlNumber = parseInt(urlNumberStr, 10);

	const commentId = parseCommentId(url);
	const isCommentEntity = !!commentId;

	const entityType: Entity["type"] = isCommentEntity
		? "comment"
		: (() => {
				switch (urlType) {
					case "discussions":
						return "discussion";
					case "issues":
						return "issue";
					default:
						return "pull_request";
				}
			})();

	const entityOrParentNumber = getEntityNumber(
		isCommentEntity,
		payload,
		urlNumber,
	);

	return createEntityInput(
		isCommentEntity,
		commentId,
		target,
		entityOrParentNumber,
		urlType,
		entityType,
	);
}

/**
 * Extracts the entity number from the payload.
 * For non-comment entities, uses the URL number.
 * For comment entities, prefers the parent entity number from the payload, but falls back
 * to the URL number for PR review comments (which lack a parent in the payload).
 * @remarks
 * Issue comments, PR conversation comments, and discussion comments will have
 * payload.issue, payload.pull_request, or payload.discussion with a number property.
 * PR review comments do not include a parent entity in the payload.
 * @param isComment Whether this is a comment entity
 * @param payload The GitHub webhook payload
 * @param urlNumber The number extracted from the URL
 * @returns The entity or parent number
 */
function getEntityNumber(
	isComment: boolean,
	payload: typeof github.context.payload,
	urlNumber: number,
): number {
	if (!isComment) {
		return urlNumber;
	}

	const parentEntity = (payload.discussion ??
		payload.issue ??
		payload.pull_request) as unknown;

	if (hasValidNumber(parentEntity)) {
		return parentEntity.number;
	}

	return urlNumber;
}

/**
 * Creates an Entity object from the parsed URL and payload data.
 *
 * Note: Type assertions are necessary because GitHub webhook payloads don't
 * distinguish between different entity types at the type level. The payload.comment,
 * payload.issue, etc. fields can contain various entity types, and we determine
 * the correct type at runtime based on URL parsing and entity metadata.
 * @param isComment Whether this is a comment entity
 * @param commentId The comment ID (if applicable)
 * @param target The target entity data from the payload
 * @param entityNumber The entity or parent number
 * @param urlType The type extracted from the URL (discussions/issues/pull)
 * @param entityType The resolved entity type
 * @returns The constructed Entity object
 */
function createEntityInput(
	isComment: boolean,
	commentId: string | undefined,
	target: EntityData,
	entityNumber: number,
	urlType: string,
	entityType: Entity["type"],
): CommentEntity | DiscussionEntity | IssueEntity | PullRequestEntity {
	return isComment
		? createCommentEntity(commentId, target, entityNumber, urlType)
		: createNonCommentEntity(target, entityNumber, entityType);
}

/**
 * Creates a CommentEntity from the parsed URL and payload data.
 * @param commentId Unique identifier for the comment extracted from the URL
 * @param target Raw payload data containing the comment's html_url and other properties
 * @param parentNumber Numeric identifier of the parent discussion, issue, or pull request
 * @param urlType URL segment that determines the parent entity type (discussions/issues/pull)
 * @returns A CommentEntity with the appropriate parent type
 * @throws Error if commentId is missing or target data is invalid
 */
function createCommentEntity(
	commentId: string | undefined,
	target: EntityData,
	parentNumber: number,
	urlType: string,
): CommentEntity {
	if (!commentId) {
		throw new Error("Comment ID is missing for comment entity.");
	}

	if (!isCommentData(target)) {
		throw new Error(
			`Invalid comment data structure. Expected object with html_url property. ` +
				`Received: ${JSON.stringify(target)}`,
		);
	}

	const parentType =
		urlType === "discussions"
			? ("discussion" as const)
			: urlType === "issues"
				? ("issue" as const)
				: ("pull_request" as const);

	return {
		commentId: +commentId,
		data: target,
		parentNumber,
		parentType,
		type: "comment",
	};
}

/**
 * Creates a non-comment Entity (Discussion, Issue, or PullRequest) from payload data.
 * @param target Raw payload data containing the entity's html_url and other properties
 * @param number Numeric identifier for the discussion, issue, or pull request
 * @param entityType Discriminator indicating whether to create a discussion, issue, or pull_request entity
 * @returns A DiscussionEntity, IssueEntity, or PullRequestEntity
 * @throws Error if target data doesn't match the expected entity type structure
 */
function createNonCommentEntity(
	target: EntityData,
	number: number,
	entityType: Entity["type"],
): DiscussionEntity | IssueEntity | PullRequestEntity {
	if (entityType === "discussion") {
		if (!isDiscussionData(target)) {
			throw new Error(
				`Invalid discussion data structure. Expected object with html_url property. ` +
					`Received: ${JSON.stringify(target)}`,
			);
		}

		return {
			data: target,
			number,
			type: "discussion",
		};
	}

	if (entityType === "issue") {
		if (!isIssueLikeData(target)) {
			throw new Error(
				`Invalid issue data structure. Expected object with html_url property. ` +
					`Received: ${JSON.stringify(target)}`,
			);
		}

		return {
			data: target as IssueEntity["data"],
			number,
			type: "issue",
		};
	}

	if (!isIssueLikeData(target)) {
		throw new Error(
			`Invalid pull request data structure. Expected object with html_url property. ` +
				`Received: ${JSON.stringify(target)}`,
		);
	}

	return {
		data: target as PullRequestEntity["data"],
		number,
		type: "pull_request",
	};
}

/**
 * Type guard to check if an object has a valid numeric identifier.
 * Ensures the number property exists, is a number type, and is positive.
 * @param entity The entity to validate
 * @returns true if the entity has a valid number property
 */
function hasValidNumber(entity: unknown): entity is { number: number } {
	return (
		entity !== null &&
		entity !== undefined &&
		typeof entity === "object" &&
		"number" in entity &&
		typeof entity.number === "number" &&
		entity.number > 0
	);
}

/**
 * Type guard to validate comment data structure.
 * Checks for essential fields that should be present in GitHub comment data.
 * @param data The data to validate
 * @returns true if data has the basic structure of comment data
 */
function isCommentData(data: unknown): data is CommentEntity["data"] {
	return (
		data !== null &&
		data !== undefined &&
		typeof data === "object" &&
		"html_url" in data &&
		typeof data.html_url === "string" &&
		"id" in data &&
		typeof data.id === "number"
	);
}

/**
 * Type guard to validate discussion data structure.
 * Checks for essential fields specific to GitHub discussions.
 * @param data The data to validate
 * @returns true if data has the basic structure of discussion data
 */
function isDiscussionData(data: unknown): data is DiscussionEntity["data"] {
	return (
		data !== null &&
		data !== undefined &&
		typeof data === "object" &&
		"html_url" in data &&
		typeof data.html_url === "string"
	);
}

/**
 * Type guard to validate issue-like data structure (issues and pull requests).
 * Checks for essential fields present in both issues and pull requests.
 * @param data The data to validate
 * @returns true if data has the basic structure of issue or pull request data
 */
function isIssueLikeData(
	data: unknown,
): data is IssueEntity["data"] | PullRequestEntity["data"] {
	return (
		data !== null &&
		data !== undefined &&
		typeof data === "object" &&
		"html_url" in data &&
		typeof data.html_url === "string"
	);
}
