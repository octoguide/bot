import { defineRule } from "./defineRule.js";

interface ForcePushesResponse {
	repository: {
		pullRequest: {
			author: null | { login: string };
			reviews: {
				nodes: {
					author: null | { __typename: string; login: string };
					submittedAt: null | string;
				}[];
			};
			timelineItems: {
				nodes: {
					actor: null | { login: string };
					afterCommit: null | { oid: string };
					createdAt: string;
				}[];
			};
		};
	};
}

export const prForcePushes = defineRule({
	about: {
		config: "strict",
		description: "PRs should not be force-pushed after they've been reviewed.",
		explanation: [
			`This repository asks that pull requests not be force-pushed after they've been reviewed.`,
			`Rewriting a pull request's history makes it harder for reviewers to see what changed between reviews.`,
		],
		name: "pr-force-pushes",
	},
	async pullRequest(context, entity) {
		if (entity.data.draft) {
			return;
		}

		const response = await context.octokit.graphql<ForcePushesResponse>(
			`
				query forcePushes($id: Int!, $owner: String!, $repo: String!) {
					repository(owner: $owner, name: $repo) {
						pullRequest(number: $id) {
							author {
								login
							}
							reviews(first: 100, states: [APPROVED, CHANGES_REQUESTED, COMMENTED, DISMISSED]) {
								nodes {
									author {
										__typename
										login
									}
									submittedAt
								}
							}
							timelineItems(itemTypes: [HEAD_REF_FORCE_PUSHED_EVENT], last: 1) {
								nodes {
									... on HeadRefForcePushedEvent {
										actor {
											login
										}
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

		const { author, reviews, timelineItems } = response.repository.pullRequest;
		const lastForcePush = timelineItems.nodes.at(0);

		if (
			!author ||
			lastForcePush?.actor?.login !== author.login ||
			lastForcePush.afterCommit?.oid !== entity.data.head.sha
		) {
			return;
		}

		const firstReviewedAt = reviews.nodes
			.filter(
				({ author: reviewer }) =>
					reviewer?.__typename !== "Bot" && reviewer?.login !== author.login,
			)
			.map(({ submittedAt }) => submittedAt)
			.filter((submittedAt) => submittedAt !== null)
			.sort()
			.at(0);

		if (!firstReviewedAt || lastForcePush.createdAt < firstReviewedAt) {
			return;
		}

		context.report({
			primary:
				"This pull request's latest changes were force-pushed after it was reviewed.",
			suggestion: [
				"To resolve this report, push any further changes as new commits rather than force-pushing.",
				"There's no need to rewrite existing commits to keep them clean.",
				"If you need to resolve conflicts, merge the base branch in instead of rebasing onto it.",
			],
		});
	},
});
