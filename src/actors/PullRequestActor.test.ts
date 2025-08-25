import type { Octokit } from "octokit";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { RepositoryLocator } from "../types/data.js";
import type { IssueLikeData } from "../types/entities.js";

import { PullRequestActor } from "./PullRequestActor.js";

const mockCore = {
	debug: vi.fn(),
};

vi.mock("@actions/core", () => ({
	get debug() {
		return mockCore.debug;
	},
}));

const mockGraphql = vi.fn();
const mockRestIssues = {
	createComment: vi.fn(),
	listComments: vi.fn(),
	updateComment: vi.fn(),
};
const mockRestPulls = {
	get: vi.fn(),
};

const mockOctokit = {
	graphql: mockGraphql,
	rest: {
		issues: mockRestIssues,
		pulls: mockRestPulls,
	},
} as unknown as Octokit;

const locator: RepositoryLocator = {
	owner: "test-owner",
	repository: "test-repo",
};

const pullNumber = 456;

describe("PullRequestActor", () => {
	let actor: PullRequestActor;

	beforeEach(() => {
		vi.clearAllMocks();
		actor = new PullRequestActor(
			pullNumber,
			"pull_request",
			locator,
			mockOctokit,
		);
	});

	describe("metadata", () => {
		it("has correct metadata properties", () => {
			expect(actor.metadata).toEqual({
				number: pullNumber,
				type: "pull_request",
			});
		});
	});

	describe("getData", () => {
		it("fetches pull request data using REST API", async () => {
			const mockPullRequestData = {
				base: {
					ref: "main",
					sha: "def456",
				},
				head: {
					ref: "feature-branch",
					sha: "abc123",
				},
				html_url: "https://github.com/test-owner/test-repo/pull/456",
				id: 789012,
				number: pullNumber,
				title: "Test Pull Request",
			} as IssueLikeData;

			mockRestPulls.get.mockResolvedValueOnce({ data: mockPullRequestData });

			const result = await actor.getData();

			expect(mockRestPulls.get).toHaveBeenCalledWith({
				owner: locator.owner,
				pull_number: pullNumber,
				repo: locator.repository,
			});
			expect(result).toBe(mockPullRequestData);
		});
	});

	describe("createComment", () => {
		it("creates a comment on the pull request", async () => {
			const commentBody = "Test PR comment body";
			const mockCommentUrl =
				"https://github.com/test-owner/test-repo/pull/456#issuecomment-789";

			mockRestIssues.createComment.mockResolvedValueOnce({
				data: { html_url: mockCommentUrl },
			});

			const result = await actor.createComment(commentBody);

			expect(mockRestIssues.createComment).toHaveBeenCalledWith({
				body: commentBody,
				issue_number: pullNumber,
				owner: locator.owner,
				repo: locator.repository,
			});
			expect(result).toBe(mockCommentUrl);
		});
	});

	describe("listComments", () => {
		it("lists comments for the pull request", async () => {
			const mockComments = [
				{
					body: "First PR comment",
					html_url:
						"https://github.com/test-owner/test-repo/pull/456#issuecomment-111",
					id: 111,
				},
				{
					body: "Second PR comment",
					html_url:
						"https://github.com/test-owner/test-repo/pull/456#issuecomment-222",
					id: 222,
				},
			];

			mockRestIssues.listComments.mockResolvedValueOnce({
				data: mockComments,
			});

			const result = await actor.listComments();

			expect(mockRestIssues.listComments).toHaveBeenCalledWith({
				issue_number: pullNumber,
				owner: locator.owner,
				per_page: 100,
				repo: locator.repository,
			});
			expect(result).toBe(mockComments);
		});
	});

	describe("updateComment", () => {
		it("updates a comment on the pull request", async () => {
			const commentId = 789;
			const newBody = "Updated PR comment body";

			mockRestIssues.updateComment.mockResolvedValueOnce({});

			await actor.updateComment(commentId, newBody);

			expect(mockRestIssues.updateComment).toHaveBeenCalledWith({
				body: newBody,
				comment_id: commentId,
				owner: locator.owner,
				repo: locator.repository,
			});
		});
	});

	describe("minimizeComment", () => {
		it("returns true when GraphQL mutation succeeds", async () => {
			mockGraphql.mockResolvedValueOnce({
				minimizeComment: {
					minimizedComment: {
						isMinimized: true,
					},
				},
			});

			const result = await actor.minimizeComment("IC_kwDOKGd-xyz789");

			expect(result).toBe(true);
			expect(mockGraphql).toHaveBeenCalledWith(
				expect.stringContaining("minimizeComment"),
				{
					commentId: "IC_kwDOKGd-xyz789",
					reason: "RESOLVED",
				},
			);
		});

		it("returns false when GraphQL mutation fails", async () => {
			mockGraphql.mockRejectedValueOnce(new Error("GraphQL Error"));

			const result = await actor.minimizeComment("IC_kwDOKGd-xyz789");

			expect(result).toBe(false);
			expect(mockCore.debug).toHaveBeenCalledWith(
				expect.stringContaining("Failed to minimize comment IC_kwDOKGd-xyz789"),
			);
		});

		it("returns false when comment is not minimized according to response", async () => {
			mockGraphql.mockResolvedValueOnce({
				minimizeComment: {
					minimizedComment: {
						isMinimized: false,
					},
				},
			});

			const result = await actor.minimizeComment("IC_kwDOKGd-xyz789");

			expect(result).toBe(false);
		});

		it("uses custom reason when provided", async () => {
			mockGraphql.mockResolvedValueOnce({
				minimizeComment: {
					minimizedComment: {
						isMinimized: true,
					},
				},
			});

			await actor.minimizeComment("IC_kwDOKGd-xyz789", "RESOLVED");

			expect(mockGraphql).toHaveBeenCalledWith(
				expect.stringContaining("minimizeComment"),
				{
					commentId: "IC_kwDOKGd-xyz789",
					reason: "RESOLVED",
				},
			);
		});
	});

	describe("unminimizeComment", () => {
		it("returns true when GraphQL mutation succeeds and comment is unminimized", async () => {
			mockGraphql.mockResolvedValueOnce({
				unminimizeComment: {
					unminimizedComment: {
						isMinimized: false,
					},
				},
			});

			const result = await actor.unminimizeComment("IC_kwDOKGd-xyz789");

			expect(result).toBe(true);
			expect(mockGraphql).toHaveBeenCalledWith(
				expect.stringContaining("unminimizeComment"),
				{
					commentId: "IC_kwDOKGd-xyz789",
				},
			);
		});

		it("returns false when GraphQL mutation fails", async () => {
			mockGraphql.mockRejectedValueOnce(new Error("GraphQL Error"));

			const result = await actor.unminimizeComment("IC_kwDOKGd-xyz789");

			expect(result).toBe(false);
			expect(mockCore.debug).toHaveBeenCalledWith(
				expect.stringContaining(
					"Failed to unminimize comment IC_kwDOKGd-xyz789",
				),
			);
		});

		it("returns false when comment is still minimized according to response", async () => {
			mockGraphql.mockResolvedValueOnce({
				unminimizeComment: {
					unminimizedComment: {
						isMinimized: true,
					},
				},
			});

			const result = await actor.unminimizeComment("IC_kwDOKGd-xyz789");

			expect(result).toBe(false);
		});

		it("calls GraphQL with correct mutation", async () => {
			mockGraphql.mockResolvedValueOnce({
				unminimizeComment: {
					unminimizedComment: {
						isMinimized: false,
					},
				},
			});

			await actor.unminimizeComment("IC_kwDOKGd-xyz789");

			expect(mockGraphql).toHaveBeenCalledWith(
				expect.stringContaining("unminimizeComment"),
				{
					commentId: "IC_kwDOKGd-xyz789",
				},
			);
		});
	});
});
