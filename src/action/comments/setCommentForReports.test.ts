import { describe, expect, it, vi } from "vitest";

import type { EntityActor } from "../../actors/types.js";
import type { IssueEntity } from "../../types/entities.js";

import { markdownReportPassMessage } from "../../reporters/markdownReporter.js";
import { setCommentForReports } from "./setCommentForReports.js";

const mockCore = {
	info: vi.fn(),
};

vi.mock("@actions/core", () => ({
	get info() {
		return mockCore.info;
	},
}));

const mockMarkdownReportPassMessage = vi.fn();

vi.mock("../../reporters/markdownReporter.js", () => ({
	get markdownReportPassMessage() {
		return mockMarkdownReportPassMessage;
	},
}));

const mockCreateNewCommentForReports = vi.fn();

vi.mock("./createNewCommentForReports.js", () => ({
	get createNewCommentForReports() {
		return mockCreateNewCommentForReports;
	},
}));

const mockGetExistingComment = vi.fn();

vi.mock("./getExistingComment.js", () => ({
	get getExistingComment() {
		return mockGetExistingComment;
	},
}));

const mockUpdateExistingCommentForReports = vi.fn();

vi.mock("./updateExistingCommentForReports.js", () => ({
	get updateExistingCommentForReports() {
		return mockUpdateExistingCommentForReports;
	},
}));

const actor = {} as EntityActor;

const entity = {
	data: {
		html_url: "github.com/owner/repo/issues/123",
	},
	number: 123,
	type: "issue",
} as IssueEntity;

const existingComment = {
	html_url: "github.com/owner/repo/issues/123#issuecomment-456",
};

const reportFail = "Oh no!";

describe(setCommentForReports, () => {
	it("returns without setting anything when the report is a pass and there is no existing comment", async () => {
		mockGetExistingComment.mockResolvedValueOnce(undefined);

		const actual = await setCommentForReports(
			actor,
			entity,
			markdownReportPassMessage,
		);

		expect(mockUpdateExistingCommentForReports).not.toHaveBeenCalled();
		expect(actual).toBeUndefined();
		expect(mockCore.info).toHaveBeenCalledWith("No existing comment found.");
	});

	it("updates the comment when the report is a pass and there is an existing comment", async () => {
		mockGetExistingComment.mockResolvedValueOnce(existingComment);

		const actual = await setCommentForReports(
			actor,
			entity,
			markdownReportPassMessage,
		);

		expect(mockUpdateExistingCommentForReports).toHaveBeenCalledWith(
			actor,
			entity,
			existingComment,
			markdownReportPassMessage,
		);
		expect(actual).toEqual({
			status: "existing",
			url: existingComment.html_url,
		});
		expect(mockCore.info).toHaveBeenCalledWith(
			`Found existing comment: ${existingComment.html_url}`,
		);
	});

	it("updates the comment when the report is a fail and there is an existing comment", async () => {
		mockGetExistingComment.mockResolvedValueOnce(existingComment);

		const actual = await setCommentForReports(actor, entity, reportFail);

		expect(mockUpdateExistingCommentForReports).toHaveBeenCalledWith(
			actor,
			entity,
			existingComment,
			reportFail,
		);
		expect(actual).toEqual({
			status: "existing",
			url: existingComment.html_url,
		});
		expect(mockCore.info).toHaveBeenCalledWith(
			`Found existing comment: ${existingComment.html_url}`,
		);
	});

	it("creates a new comment when the report is a fail and there is not an existing comment", async () => {
		const newCommentUrl = "github.com/owner/repo/issues/123#issuecomment-789";
		mockGetExistingComment.mockResolvedValueOnce(undefined);
		mockCreateNewCommentForReports.mockResolvedValueOnce(newCommentUrl);

		const actual = await setCommentForReports(actor, entity, reportFail);

		expect(mockCreateNewCommentForReports).toHaveBeenCalledWith(
			actor,
			entity,
			reportFail,
		);
		expect(actual).toEqual({
			status: "created",
			url: newCommentUrl,
		});
		expect(mockCore.info).toHaveBeenCalledWith(
			`Created new comment: ${newCommentUrl}`,
		);
	});
});
