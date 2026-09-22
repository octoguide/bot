import type { Octokit } from "octokit";

import { describe, expect, it, vi } from "vitest";

import type { RepositoryLocator } from "../types/data.js";

import { DiscussionActor } from "./DiscussionActor.js";

const mockPaginate = vi.fn();

const mockOctokit = {
	paginate: mockPaginate,
} as unknown as Octokit;

const locator: RepositoryLocator = {
	owner: "test-owner",
	repository: "test-repo",
};

describe("DiscussionActor", () => {
	describe("closeEntity", () => {
		it("throws because closing discussions is not yet implemented", async () => {
			const actor = new DiscussionActor(1, locator, mockOctokit);

			await expect(actor.closeEntity()).rejects.toThrow(
				"closeEntity is not yet implemented for this actor type.",
			);
		});
	});

	describe("listComments", () => {
		it("paginates through all comments for the discussion", async () => {
			const comments = [{ id: 111 }, { id: 222 }];

			mockPaginate.mockResolvedValueOnce(comments);

			const actor = new DiscussionActor(1, locator, mockOctokit);

			const result = await actor.listComments();

			expect(mockPaginate).toHaveBeenCalledWith(
				"GET /repos/{owner}/{repo}/discussions/{discussion_number}/comments",
				{
					discussion_number: 1,
					owner: locator.owner,
					per_page: 100,
					repo: locator.repository,
				},
			);
			expect(result).toBe(comments);
		});
	});
});
