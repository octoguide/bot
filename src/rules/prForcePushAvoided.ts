import { defineRule } from "./defineRule.js";

interface ForcePushesResponse {
	repository: {
		pullRequest: {
			reviews: {
				nodes: {
					submittedAt: null | string;
				}[];
			};
			timelineItems: {
				nodes: {
					afterCommit: null | { oid: string };
					createdAt: string;
				}[];
			};
		};
	};
}

export const prForcePushAvoided = defineRule({
	about: {
		config: "strict",
		description: "PRs should not be force-pushed after they've been reviewed.",
		explanation: [
			`This repository asks that pull requests not be force-pushed after they've been reviewed.`,
			`Rewriting a pull request's history makes it harder for reviewers to see what changed between reviews.`,
		],
		name: "pr-force-push-avoided",
	},
	async pullRequest(context, entity) {
		const response = await context.octokit.graphql<ForcePushesResponse>(
			`
				query forcePushes($id: Int!, $owner: String!, $repo: String!) {
					repository(owner: $owner, name: $repo) {
						pullRequest(number: $id) {
							reviews(first: 1, states: [APPROVED, CHANGES_REQUESTED, COMMENTED, DISMISSED]) {
								nodes {
									submittedAt
								}
							}
							timelineItems(itemTypes: [HEAD_REF_FORCE_PUSHED_EVENT], last: 1) {
								nodes {
									... on HeadRefForcePushedEvent {
										afterCommit {
											oid
										}
										createdAt
									}
								}
							}
						}
					}
				}
			`,
			{ id: entity.number },
		);

		const { reviews, timelineItems } = response.repository.pullRequest;
		const firstReviewedAt = reviews.nodes.at(0)?.submittedAt;
		const lastForcePush = timelineItems.nodes.at(0);

		if (
			!firstReviewedAt ||
			lastForcePush?.afterCommit?.oid !== entity.data.head.sha ||
			lastForcePush.createdAt < firstReviewedAt
		) {
			return;
		}

		context.report({
			primary:
				"This pull request's latest changes were force-pushed after it was reviewed.",
			suggestion: [
				"To resolve this report, push any further changes as new commits rather than force-pushing.",
				"There's no need to rewrite existing commits to keep them clean.",
			],
		});
	},
});
