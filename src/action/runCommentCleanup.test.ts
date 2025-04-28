import type * as github from "@actions/github";

import { describe, expect, it, vi } from "vitest";

import { runCommentCleanup } from "./runCommentCleanup";

const mockCore = {
	info: vi.fn(),
};

vi.mock("@actions/core", () => ({
	get info() {
		return mockCore.info;
	},
}));

const mockOctokitFromAuth = vi.fn();

vi.mock("octokit-from-auth", () => ({
	get octokitFromAuth() {
		return mockOctokitFromAuth;
	},
}));

const mockCreateActor = vi.fn();

vi.mock("../actors/createActor.js", () => ({
	get createActor() {
		return mockCreateActor;
	},
}));

const mockGetExistingComment = vi.fn();

vi.mock("./comments/getExistingComment.js", () => ({
	get getExistingComment() {
		return mockGetExistingComment;
	},
}));

const auth = "gho_...";
const locator = { owner: "owner", repository: "repo" };
const url = "/repos/owner/repo/issues/1";

describe(runCommentCleanup, () => {
	it("does nothing when the payload does not contain a comment", async () => {
		const payload = {
			issue: {},
		} as typeof github.context.payload;

		await runCommentCleanup({ auth, payload, url });

		expect(mockOctokitFromAuth).not.toHaveBeenCalled();
	});

	it("throws an error when the actor cannot be resolved", async () => {
		const payload = {
			comment: {},
		} as typeof github.context.payload;

		mockCreateActor.mockReturnValueOnce({});

		await expect(runCommentCleanup({ auth, payload, url })).rejects.toThrow(
			"Could not resolve GitHub entity actor.",
		);
	});

	it("logs info without throwing when an existing comment cannot be found", async () => {
		const payload = {
			comment: {},
		} as typeof github.context.payload;

		mockCreateActor.mockReturnValueOnce({ actor: {}, locator });
		mockGetExistingComment.mockResolvedValueOnce(undefined);

		await runCommentCleanup({ auth, payload, url });
		expect(mockCore.info).toHaveBeenCalledWith(
			"No existing comment found. Nothing to clean up.",
		);
	});

	it("deletes the comment when it exists as a discussion comment", async () => {
		const payload = {
			comment: { id: 123 },
			discussion: {},
		} as typeof github.context.payload;
		const nodeId = "abc123";

		mockOctokitFromAuth.mockResolvedValueOnce({
			graphql: vi.fn(),
		});
		mockCreateActor.mockReturnValueOnce({ actor: {}, locator });
		mockGetExistingComment.mockResolvedValueOnce({
			node_id: nodeId,
		});

		await runCommentCleanup({ auth, payload, url });
		expect(mockCore.info).toHaveBeenCalledWith(
			`Deleting discussion comment with node id: ${nodeId}`,
		);
	});

	it("deletes the comment when it exists as an issue-like comment", async () => {
		const id = 123;
		const payload = {
			comment: { id },
			issue: {},
		} as typeof github.context.payload;

		mockOctokitFromAuth.mockResolvedValueOnce({
			rest: {
				issues: {
					deleteComment: vi.fn(),
				},
			},
		});
		mockCreateActor.mockReturnValueOnce({ actor: {}, locator });
		mockGetExistingComment.mockResolvedValueOnce({ id });

		await runCommentCleanup({ auth, payload, url });
		expect(mockCore.info).toHaveBeenCalledWith(
			`Deleting issue-like comment with id: ${id}`,
		);
	});
});
