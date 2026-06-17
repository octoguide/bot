import type { Octokit } from "octokit";

import { describe, expect, it } from "vitest";

import type { RepositoryLocator } from "../types/data.js";

import { DiscussionActor } from "./DiscussionActor.js";

const mockOctokit = {} as unknown as Octokit;

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
});
