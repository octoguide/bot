import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type { DiscussionData, DiscussionEntity } from "../types/entities.js";

import { DiscussionActorBase } from "./DiscussionActorBase.js";

interface CreateCommentResponse {
	addDiscussionComment: {
		comment: {
			body: string;
			url: string;
		};
	};
}

interface GetDiscussionResponse {
	repository: {
		discussion: {
			id: string;
		};
	};
}
export class DiscussionActor extends DiscussionActorBase<DiscussionData> {
	readonly metadata: Omit<DiscussionEntity, "data">;

	constructor(
		entityNumber: number,
		locator: RepositoryLocator,
		octokit: Octokit,
	) {
		super(entityNumber, locator, octokit);

		this.metadata = {
			number: entityNumber,
			type: "discussion",
		};
	}

	async createComment(body: string) {
		const { repository } = await this.octokit.graphql<GetDiscussionResponse>(
			`
				query($owner: String!, $repo: String!, $number: Int!) {
					repository(owner: $owner, name: $repo) {
						discussion(number: $number) {
							id
						}
					}
				}
			`,
			{
				number: this.entityNumber,
				owner: this.locator.owner,
				repo: this.locator.repository,
			},
		);

		const discussionId = repository.discussion.id;

		const commentResponse = await this.octokit.graphql<CreateCommentResponse>(
			`
				mutation($body: String!, $discussionId: ID!) {
					addDiscussionComment(input: {
						discussionId: $discussionId,
						body: $body
					}) {
						comment {
							body
							url
						}
					}
				}
			`,
			{ body, discussionId },
		);

		return commentResponse.addDiscussionComment.comment.url;
	}

	async getData() {
		const response = await this.octokit.request(
			"GET /repos/{owner}/{repo}/discussions/{discussion_number}",
			{
				discussion_number: this.entityNumber,
				owner: this.locator.owner,
				repo: this.locator.repository,
			},
		);

		// https://github.com/github/rest-api-description/issues/4702
		return response.data as DiscussionData;
	}
}
