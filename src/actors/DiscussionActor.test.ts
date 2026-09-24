import { describe, expect, it } from "vitest";

import type { LocatedOctokit } from "../types/octokit.js";

import { DiscussionActor } from "./DiscussionActor.js";

const mockOctokit = {} as unknown as LocatedOctokit;

describe("DiscussionActor", () => {
	describe("closeEntity", () => {
		it("throws because closing discussions is not yet implemented", async () => {
			const actor = new DiscussionActor(1, mockOctokit);

			await expect(actor.closeEntity()).rejects.toThrow(
				"closeEntity is not yet implemented for this actor type.",
			);
		});
	});
});
