import { describe, expect, it, vi } from "vitest";

import type { LocatedOctokit } from "../types/octokit.ts";

import { DiscussionActor } from "./DiscussionActor.ts";

const mockPaginate = vi.fn();

const mockOctokit = {
	paginate: mockPaginate,
} as unknown as LocatedOctokit;

describe("DiscussionActor", () => {
	describe("closeEntity", () => {
		it("throws because closing discussions is not yet implemented", async () => {
			const actor = new DiscussionActor(1, mockOctokit);

			await expect(actor.closeEntity()).rejects.toThrow(
				"closeEntity is not yet implemented for this actor type.",
			);
		});
	});

	describe("listComments", () => {
		it("paginates through all comments for the discussion", async () => {
			const comments = [{ id: 111 }, { id: 222 }];

			mockPaginate.mockResolvedValueOnce(comments);

			const actor = new DiscussionActor(1, mockOctokit);

			const result = await actor.listComments();

			expect(mockPaginate).toHaveBeenCalledWith(
				"GET /repos/{owner}/{repo}/discussions/{discussion_number}/comments",
				{ discussion_number: 1, per_page: 100 },
			);
			expect(result).toBe(comments);
		});
	});
});
