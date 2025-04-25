import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export type CommentAbleEntity =
	| DiscussionEntity
	| IssueEntity
	| PullRequestEntity;

export type CommentAbleEntityData = CommentAbleEntity["data"];

export type CommentAbleEntityType = CommentAbleEntity["type"];

export type CommentData =
	RestEndpointMethodTypes["issues"]["getComment"]["response"]["data"];

export interface CommentEntity {
	commentId: number;
	data: CommentData;
	parent: CommentAbleEntityData;
	parentType: CommentAbleEntityType;
	type: "comment";
	user?: string;
}

// https://github.com/github/rest-api-description/issues/4702
// RestEndpointMethodTypes["discussions"]["get"]["response"]["data"];
export interface DiscussionData {
	body: string;
	html_url: string;
	number: number;
	title: string;
	url: string;
	user: { login: string };
}

export interface DiscussionEntity {
	data: DiscussionData;
	id: number;
	type: "discussion";
	user?: string;
}

export type Entity =
	| CommentEntity
	| DiscussionEntity
	| IssueEntity
	| PullRequestEntity;

export type EntityType = Entity["type"];

export type IssueData =
	RestEndpointMethodTypes["issues"]["get"]["response"]["data"];

export interface IssueEntity {
	data: IssueData;
	id: number;
	type: "issue";
	user?: string;
}

export type IssueLikeEntity = IssueEntity | PullRequestEntity;

export type IssueLikeEntityType = IssueLikeEntity["type"];

export type PullRequestData =
	RestEndpointMethodTypes["pulls"]["get"]["response"]["data"];

export interface PullRequestEntity {
	data: PullRequestData;
	id: number;
	type: "pull_request";
	user: string;
}
