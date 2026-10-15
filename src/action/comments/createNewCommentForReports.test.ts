import { describe, expect, it, vi } from "vitest";

import type { EntityActor } from "../../actors/types.ts";
import type { CommentEntity, DiscussionEntity } from "../../types/entities.ts";
import type { Settings } from "../../types/settings.ts";

import { createCommentBody } from "./createCommentBody.ts";
import { createNewCommentForReports } from "./createNewCommentForReports.ts";

const mockCore = {
	info: vi.fn(),
};

vi.mock("@actions/core", () => ({
	get info() {
		return mockCore.info;
	},
}));

const reported = "Oh no!";

const mockCreateComment = vi.fn();
const entityActor = {
	createComment: mockCreateComment,
} as unknown as EntityActor;

const settings = {
	comments: {
		footer: "Test footer",
		header: "Test header",
	},
} satisfies Settings;

describe(createNewCommentForReports, () => {
	it("targets the parent number when the entity is a comment", async () => {
		const parentNumber = 123;

		const entity = {
			data: {
				html_url: "github.com/owner/repo/issues/123#issuecomment-456",
			},
			parentNumber,
			type: "comment",
		} as CommentEntity;

		await createNewCommentForReports(entityActor, entity, reported, settings);

		expect(mockCreateComment).toHaveBeenCalledWith(
			createCommentBody(entity, reported, settings),
		);
		expect(mockCore.info).toHaveBeenCalledWith(
			`Target number for comment creation: ${parentNumber.toString()}`,
		);
	});

	it("targets the entity's number when the entity is not a comment", async () => {
		const number = 456;

		const entity = {
			data: {
				html_url: "github.com/owner/repo/issues/456",
			},
			number,
			type: "discussion",
		} as DiscussionEntity;

		await createNewCommentForReports(entityActor, entity, reported, settings);

		expect(mockCreateComment).toHaveBeenCalledWith(
			createCommentBody(entity, reported, settings),
		);
		expect(mockCore.info).toHaveBeenCalledWith(
			`Target number for comment creation: ${number.toString()}`,
		);
	});
});
