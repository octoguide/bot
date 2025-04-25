import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";

import type { Entity, IssueData } from "../../types/entities.js";

import { RuleAbout, RuleReportData } from "../../types/rules.js";
import { getCommentForReports } from "./setCommentForReports.js";

const mockCreateNewCommentForReports = vi.fn();
const mockGetExistingComment = vi.fn();
const mockUpdateExistingCommentAsPassed = vi.fn();
const mockUpdateExistingCommentForReports = vi.fn();

vi.mock("./createNewCommentForReports.js", () => ({
	get createNewCommentForReports() {
		return mockCreateNewCommentForReports;
	},
}));

vi.mock("./getExistingComment.js", () => ({
	get getExistingComment() {
		return mockGetExistingComment;
	},
}));

vi.mock("./updateExistingCommentAsPassed.js", () => ({
	get updateExistingCommentAsPassed() {
		return mockUpdateExistingCommentAsPassed;
	},
}));

vi.mock("./updateExistingCommentForReports.js", () => ({
	get updateExistingCommentForReports() {
		return mockUpdateExistingCommentForReports;
	},
}));

vi.mock("@actions/core");

const fakeAbout = {
	config: "recommended",
	description: "Fake description.",
	explanation: ["Fake explanation."],
	name: "fake-rule",
} satisfies RuleAbout;

const fakeData = {
	primary: "Fake primary.",
	suggestion: ["Fake suggestion."],
} satisfies RuleReportData;

const fakeEntity = {
	data: {
		html_url: "fake-html-url",
		id: 123,
		url: "fake-url",
	} as IssueData,
	id: 123,
	type: "issue",
	user: "fake-user",
} satisfies Entity;

const fakeLocator = { owner: "owner", repository: "repo" };

const mockOctokit = {
	//
} as Octokit;

describe("getCommentForReports", () => {
	it("calls updateExistingCommentAsPassed when there are no reports and there is an existing comment", async () => {
		const existingComment = { url: "http://example.com/comment" };
		mockGetExistingComment.mockResolvedValue(existingComment);

		const result = await getCommentForReports(
			fakeEntity,
			fakeLocator,
			mockOctokit,
			[],
		);

		expect(mockGetExistingComment).toHaveBeenCalledWith(
			fakeEntity,
			fakeLocator,
			mockOctokit,
		);
		expect(mockUpdateExistingCommentAsPassed).toHaveBeenCalledWith(
			fakeEntity,
			existingComment,
			fakeLocator,
			mockOctokit,
		);
		expect(result).toEqual({ status: "existing", url: existingComment.url });
	});

	it("does not call updateExistingCommentAsPassed when there are no reports and there is no existing comment", async () => {
		mockGetExistingComment.mockResolvedValue(undefined);

		const result = await getCommentForReports(
			fakeEntity,
			fakeLocator,
			mockOctokit,
			[],
		);

		expect(mockGetExistingComment).toHaveBeenCalledWith(
			fakeEntity,
			fakeLocator,
			mockOctokit,
		);
		expect(mockUpdateExistingCommentAsPassed).not.toHaveBeenCalled();
		expect(result).toBeUndefined();
	});

	it("calls updateExistingCommentForReports when there are reports and there is an existing comment", async () => {
		const fakeReports = [{ about: fakeAbout, data: fakeData }];
		const existingComment = { url: "http://example.com/comment" };
		mockGetExistingComment.mockResolvedValue(existingComment);

		const result = await getCommentForReports(
			fakeEntity,
			fakeLocator,
			mockOctokit,
			fakeReports,
		);

		expect(mockGetExistingComment).toHaveBeenCalledWith(
			fakeEntity,
			fakeLocator,
			mockOctokit,
		);
		expect(mockUpdateExistingCommentForReports).toHaveBeenCalledWith(
			fakeEntity,
			existingComment,
			fakeLocator,
			mockOctokit,
			fakeReports,
		);
		expect(result).toEqual({ status: "existing", url: existingComment.url });
	});

	it("calls createNewCommentForReports when there are reports and no existing comment", async () => {
		const fakeReports = [{ about: fakeAbout, data: fakeData }];
		const newComment = { url: "http://example.com/new-comment" };
		mockCreateNewCommentForReports.mockResolvedValue(newComment);
		mockGetExistingComment.mockResolvedValue(undefined);

		const result = await getCommentForReports(
			fakeEntity,
			fakeLocator,
			mockOctokit,
			fakeReports,
		);

		expect(mockGetExistingComment).toHaveBeenCalledWith(
			fakeEntity,
			fakeLocator,
			mockOctokit,
		);
		expect(mockCreateNewCommentForReports).toHaveBeenCalledWith(
			fakeEntity,
			fakeLocator,
			mockOctokit,
			fakeReports,
		);
		expect(result).toEqual({ status: "created", url: newComment.url });
	});

	it("returns undefined when there are no reports and no existing comment", async () => {
		mockGetExistingComment.mockResolvedValue(undefined);

		const result = await getCommentForReports(
			fakeEntity,
			fakeLocator,
			mockOctokit,
			[],
		);

		expect(mockGetExistingComment).toHaveBeenCalledWith(
			fakeEntity,
			fakeLocator,
			mockOctokit,
		);
		expect(result).toBeUndefined();
	});
});
