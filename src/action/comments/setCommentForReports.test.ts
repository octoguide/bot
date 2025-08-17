import { beforeEach, describe, expect, it, vi } from "vitest";

import type { EntityActor } from "../../actors/types.js";
import type { IssueEntity } from "../../types/entities.js";
import type { Settings } from "../../types/settings.js";

import { markdownReportPassMessage } from "../../reporters/markdownReporter.js";
import { setCommentForReports } from "./setCommentForReports.js";

const mockCore = {
	debug: vi.fn(),
	info: vi.fn(),
	warning: vi.fn(),
};

vi.mock("@actions/core", () => ({
	get debug() {
		return mockCore.debug;
	},
	get info() {
		return mockCore.info;
	},
	get warning() {
		return mockCore.warning;
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

const mockMinimizeComment = vi.fn();
const mockUnminimizeComment = vi.fn();

const actor = {
	minimizeComment: mockMinimizeComment,
	unminimizeComment: mockUnminimizeComment,
} as unknown as EntityActor;

const entity = {
	data: {
		html_url: "github.com/owner/repo/issues/123",
	},
	number: 123,
	type: "issue",
} as IssueEntity;

const existingComment = {
	body: "Previous comment content",
	html_url: "github.com/owner/repo/issues/123#issuecomment-456",
	id: 456,
	node_id: "IC_kwDOKGd-abc123",
};

const existingResolvedComment = {
	body: "Previous comment content\n\n<!-- resolved-by: OctoGuide -->",
	html_url: "github.com/owner/repo/issues/123#issuecomment-456",
	id: 456,
	node_id: "IC_kwDOKGd-abc123",
};

const existingCommentWithoutNodeId = {
	body: "Previous comment content",
	html_url: "github.com/owner/repo/issues/123#issuecomment-456",
	id: 456,
	// node_id is missing
};

const existingCommentWithoutBody = {
	// body is missing
	html_url: "github.com/owner/repo/issues/123#issuecomment-456",
	id: 456,
	node_id: "IC_kwDOKGd-abc123",
};

const existingUnresolvedComment = {
	body: "Previous comment content without resolution marker",
	html_url: "github.com/owner/repo/issues/123#issuecomment-456",
	id: 456,
	node_id: "IC_kwDOKGd-abc123",
};

const reportFail = "Oh no!";

const settings = {
	comments: {
		footer: "Test footer",
		header: "Test header",
	},
} satisfies Settings;

describe(setCommentForReports, () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockMinimizeComment.mockResolvedValue(true);
		mockUnminimizeComment.mockResolvedValue(true);
	});

	it("returns without setting anything when the report is a pass and there is no existing comment", async () => {
		mockGetExistingComment.mockResolvedValueOnce(undefined);

		const actual = await setCommentForReports(
			actor,
			entity,
			markdownReportPassMessage,
			settings,
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
			settings,
		);

		expect(mockUpdateExistingCommentForReports).toHaveBeenCalledWith(
			actor,
			entity,
			existingComment,
			markdownReportPassMessage,
			settings,
		);
		expect(mockMinimizeComment).toHaveBeenCalledWith(existingComment.node_id);
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

		const actual = await setCommentForReports(
			actor,
			entity,
			reportFail,
			settings,
		);

		expect(mockUpdateExistingCommentForReports).toHaveBeenCalledWith(
			actor,
			entity,
			existingComment,
			reportFail,
			settings,
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

		const actual = await setCommentForReports(
			actor,
			entity,
			reportFail,
			settings,
		);

		expect(mockCreateNewCommentForReports).toHaveBeenCalledWith(
			actor,
			entity,
			reportFail,
			settings,
		);
		expect(actual).toEqual({
			status: "created",
			url: newCommentUrl,
		});
		expect(mockCore.info).toHaveBeenCalledWith(
			`Created new comment: ${newCommentUrl}`,
		);
	});

	it("minimizes comment when report passes with no violations", async () => {
		mockGetExistingComment.mockResolvedValueOnce(existingComment);
		mockUpdateExistingCommentForReports.mockResolvedValueOnce(undefined);

		const actual = await setCommentForReports(
			actor,
			entity,
			markdownReportPassMessage,
			settings,
		);

		expect(mockUpdateExistingCommentForReports).toHaveBeenCalledWith(
			actor,
			entity,
			existingComment,
			markdownReportPassMessage,
			settings,
		);
		expect(mockMinimizeComment).toHaveBeenCalledWith(existingComment.node_id);
		expect(actual).toEqual({
			status: "existing",
			url: existingComment.html_url,
		});
	});

	it("unminimize a previously resolved comment when new violations are detected", async () => {
		mockGetExistingComment.mockResolvedValueOnce(existingResolvedComment);
		mockUpdateExistingCommentForReports.mockResolvedValueOnce(undefined);

		const actual = await setCommentForReports(
			actor,
			entity,
			reportFail,
			settings,
		);

		expect(mockUpdateExistingCommentForReports).toHaveBeenCalledWith(
			actor,
			entity,
			existingResolvedComment,
			reportFail,
			settings,
		);
		expect(mockUnminimizeComment).toHaveBeenCalledWith(
			existingResolvedComment.node_id,
		);
		expect(actual).toEqual({
			status: "existing",
			url: existingResolvedComment.html_url,
		});
	});

	it("logs warning when minimize comment fails due to permissions", async () => {
		mockGetExistingComment.mockResolvedValueOnce(existingComment);
		mockMinimizeComment.mockResolvedValueOnce(false); // Simulate failure
		mockUpdateExistingCommentForReports.mockResolvedValueOnce(undefined);

		const actual = await setCommentForReports(
			actor,
			entity,
			markdownReportPassMessage,
			settings,
		);

		expect(mockCore.warning).toHaveBeenCalledWith(
			`Failed to minimize comment ${existingComment.node_id}`,
		);
		expect(actual).toEqual({
			status: "existing",
			url: existingComment.html_url,
		});
	});

	it("logs warning when unminimize comment fails due to permissions", async () => {
		mockGetExistingComment.mockResolvedValueOnce(existingResolvedComment);
		mockUnminimizeComment.mockResolvedValueOnce(false); // Simulate failure
		mockUpdateExistingCommentForReports.mockResolvedValueOnce(undefined);

		const actual = await setCommentForReports(
			actor,
			entity,
			reportFail,
			settings,
		);

		expect(mockCore.warning).toHaveBeenCalledWith(
			`Failed to unminimize comment ${existingResolvedComment.node_id}`,
		);
		expect(actual).toEqual({
			status: "existing",
			url: existingResolvedComment.html_url,
		});
	});

	it("does not attempt to minimize comment when node_id is missing", async () => {
		mockGetExistingComment.mockResolvedValueOnce(existingCommentWithoutNodeId);
		mockUpdateExistingCommentForReports.mockResolvedValueOnce(undefined);

		const actual = await setCommentForReports(
			actor,
			entity,
			markdownReportPassMessage,
			settings,
		);

		expect(mockUpdateExistingCommentForReports).toHaveBeenCalledWith(
			actor,
			entity,
			existingCommentWithoutNodeId,
			markdownReportPassMessage,
			settings,
		);

		expect(mockMinimizeComment).not.toHaveBeenCalled();
		expect(mockUnminimizeComment).not.toHaveBeenCalled();
		expect(actual).toEqual({
			status: "existing",
			url: existingCommentWithoutNodeId.html_url,
		});
	});

	it("does not attempt to unminimize when comment body is missing", async () => {
		mockGetExistingComment.mockResolvedValueOnce(existingCommentWithoutBody);
		mockUpdateExistingCommentForReports.mockResolvedValueOnce(undefined);

		const actual = await setCommentForReports(
			actor,
			entity,
			reportFail,
			settings,
		);

		expect(mockMinimizeComment).not.toHaveBeenCalled();
		expect(mockUnminimizeComment).not.toHaveBeenCalled();
		expect(actual).toEqual({
			status: "existing",
			url: existingCommentWithoutBody.html_url,
		});
	});

	it("does not attempt to unminimize when comment is not resolved", async () => {
		mockGetExistingComment.mockResolvedValueOnce(existingUnresolvedComment);
		mockUpdateExistingCommentForReports.mockResolvedValueOnce(undefined);

		const actual = await setCommentForReports(
			actor,
			entity,
			reportFail,
			settings,
		);

		expect(mockMinimizeComment).not.toHaveBeenCalled();
		expect(mockUnminimizeComment).not.toHaveBeenCalled();
		expect(actual).toEqual({
			status: "existing",
			url: existingUnresolvedComment.html_url,
		});
	});
});
