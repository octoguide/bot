import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export type CommentAbleEntity =
	| DiscussionEntity
	| IssueEntity
	| PullRequestEntity;

export type CommentAbleEntityType = CommentAbleEntity["type"];

export type CommentData =
	RestEndpointMethodTypes["issues"]["getComment"]["response"]["data"];

export interface CommentEntity {
	commentNumber: number;
	data: CommentData;
	parentNumber: number;
	parentType: CommentAbleEntityType;
	type: "comment";
}

export type EntityData = Entity["data"];

export type IssueLikeData = IssueLikeEntity["data"];

// https://github.com/github/rest-api-description/issues/4702
// RestEndpointMethodTypes["discussions"]["get"]["response"]["data"];
export interface DiscussionData {
	body: string;
	html_url: string;
	number: number;
	title: string;
	user: { login: string };
}

export interface DiscussionEntity {
	data: DiscussionData;
	number: number;
	type: "discussion";
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
	number: number;
	type: "issue";
}

export type IssueLikeEntity = IssueEntity | PullRequestEntity;

export type IssueLikeEntityType = IssueLikeEntity["type"];

export type PullRequestData =
	RestEndpointMethodTypes["pulls"]["get"]["response"]["data"];

export interface PullRequestEntity {
	data: PullRequestData;
	number: number;
	type: "pull_request";
}
