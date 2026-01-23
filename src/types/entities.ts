import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export type CommentAbleEntity =
	| DiscussionEntity
	| IssueEntity
	| PullRequestEntity;

export type CommentAbleEntityType = CommentAbleEntity["type"];

export type CommentData =
	RestEndpointMethodTypes["issues"]["getComment"]["response"]["data"];

/**
 * A resolved comment entity from GitHub.
 * Can be a comment on an issue, pull request, or discussion.
 */
export interface CommentEntity {
	commentId: number;
	data: CommentData;
	parentNumber: number;
	parentType: CommentAbleEntityType;
	type: "comment";
}

export type EntityData = Entity["data"];

export type IssueLikeData = IssueLikeEntity["data"];

// It would be nice to use a GitHub-provided type, but ...
// https://github.com/github/rest-api-description/issues/4702

/**
 * Data for a GitHub discussion.
 * @see {@link https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions#discussion | GitHub Discussions API}
 */
export interface DiscussionData {
	body: string;
	html_url: string;
	number: number;
	title: string;
	user: { login: string };
}

/**
 * A resolved discussion entity from GitHub.
 */
export interface DiscussionEntity {
	data: DiscussionData;
	number: number;
	type: "discussion";
}

/**
 * A resolved entity retrieved from the GitHub API.
 * Can be a comment, discussion, issue, or pull request.
 *
 * Each entity contains:
 * - `data`: The direct data returned from the GitHub API
 * - `type`: The type of entity, indicating what `data` contains:
 *   - `"comment"`: {@link https://docs.github.com/en/rest/issues/comments | issue/PR comment} or {@link https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions#discussioncomment | discussion comment}
 *   - `"discussion"`: {@link https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions#discussion | discussion data}
 *   - `"issue"`: {@link https://docs.github.com/en/rest/issues/issues#get-an-issue | issue data}
 *   - `"pull_request"`: {@link https://docs.github.com/en/rest/pulls/pulls#get-a-pull-request | pull request data}
 */
export type Entity =
	| CommentEntity
	| DiscussionEntity
	| IssueEntity
	| PullRequestEntity;

export type EntityType = Entity["type"];

export type IssueData =
	RestEndpointMethodTypes["issues"]["get"]["response"]["data"];

/**
 * A resolved issue entity from GitHub.
 */
export interface IssueEntity {
	data: IssueData;
	number: number;
	type: "issue";
}

export type IssueLikeEntity = IssueEntity | PullRequestEntity;

export type IssueLikeEntityType = IssueLikeEntity["type"];

export type PullRequestData =
	RestEndpointMethodTypes["pulls"]["get"]["response"]["data"];

/**
 * A resolved pull request entity from GitHub.
 */
export interface PullRequestEntity {
	data: PullRequestData;
	number: number;
	type: "pull_request";
}
