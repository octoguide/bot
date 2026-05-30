import { beforeEach, describe, expect, it, vi } from "vitest";

import type { EntityActor } from "../../actors/types.js";
import type { IssueEntity, PullRequestEntity } from "../../types/entities.js";
import type { RuleReport, RuleReportData } from "../../types/reports.js";
import type { RuleAboutWithUrl } from "../../types/rules.js";
import type { Settings } from "../../types/settings.js";

import { outputActionReports } from "./outputActionReports.js";

const mockCore = {
	debug: vi.fn(),
	info: vi.fn(),
	setFailed: vi.fn(),
	summary: {
		addHeading: vi.fn(),
		addRaw: vi.fn(),
		addSeparator: vi.fn(),
		write: vi.fn(),
	},
};

vi.mock("@actions/core", () => ({
	get debug() {
		return mockCore.debug;
	},
	get info() {
		return mockCore.info;
	},
	get setFailed() {
		return mockCore.setFailed;
	},
	get summary() {
		return mockCore.summary;
	},
}));

const mockSetCommentForReports = vi.fn();

vi.mock("./setCommentForReports.js", () => ({
	get setCommentForReports() {
		return mockSetCommentForReports;
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

const fakeAbout = {
	description: "Fake description.",
	explanation: ["Fake explanation."],
	name: "fake-rule",
	url: "https://octo.guide/rules/fake-rule",
} satisfies RuleAboutWithUrl;

const fakeData = {
	primary: "Fake primary.",
	suggestion: ["Fake suggestion."],
} satisfies RuleReportData;

const reports = [{ about: fakeAbout, data: fakeData }] satisfies RuleReport[];

const fakeComment = {
	status: "created",
	url: "github.com/owner/repo/issues/123#issuecomment-123456789",
};

const mockConsole = {
	error: vi.fn(),
	info: vi.fn(),
};
const settings = {
	comments: {
		footer: "Test footer",
		header: "Test header",
	},
} satisfies Settings;

describe(outputActionReports, () => {
	beforeEach(() => {
		Object.assign(console, mockConsole);
	});

	it("logs info and not error when no comment is created, successfully", async () => {
		mockSetCommentForReports.mockResolvedValueOnce(undefined);

		await outputActionReports(actor, entity, reports, settings);

		expect(mockCore.info.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "No comment created.",
			  ],
			]
		`);
		expect(mockCore.summary.write).toHaveBeenCalled();
		expect(mockCore.setFailed).toHaveBeenCalled();
	});

	it("logs info and not error when comment creation succeeds", async () => {
		mockSetCommentForReports.mockResolvedValueOnce(fakeComment);

		await outputActionReports(actor, entity, reports, settings);

		expect(mockCore.info.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Reports comment: github.com/owner/repo/issues/123#issuecomment-123456789 (created)",
			  ],
			]
		`);
		expect(mockCore.summary.write).toHaveBeenCalled();
		expect(mockCore.setFailed).toHaveBeenCalled();
	});

	it("logs the request error when comment creation fails with a 403 GitHub error", async () => {
		mockSetCommentForReports.mockRejectedValueOnce({
			message: "Unauthorized.",
			status: 403,
		});

		await outputActionReports(actor, entity, reports, settings);

		expect(mockCore.info.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Received an error attempting to set comments.",
			  ],
			  [
			    "This is expected if the action is run for a PR by a fork of a public repository.",
			  ],
			]
		`);
		expect(mockConsole.error).not.toHaveBeenCalled();
	});

	it("logs the error as an error when comment creation fails with an unknown error", async () => {
		mockSetCommentForReports.mockRejectedValueOnce(new Error("Oh no!"));

		await outputActionReports(actor, entity, reports, settings);

		expect(mockCore.info.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Received an error attempting to set comments.",
			  ],
			]
		`);
		expect(mockConsole.error.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    [Error: Oh no!],
			  ],
			]
		`);
		expect(mockCore.summary.write).toHaveBeenCalled();
		expect(mockCore.setFailed).toHaveBeenCalled();
	});

	it("does not write an Actions summary when there are no reports", async () => {
		mockSetCommentForReports.mockResolvedValueOnce(undefined);

		await outputActionReports(actor, entity, [], settings);

		expect(mockCore.summary.write).not.toHaveBeenCalled();
		expect(mockCore.setFailed).not.toHaveBeenCalled();
	});

	describe("action: close", () => {
		const closeEntity = vi.fn();

		const actorWithClose = { closeEntity } as unknown as EntityActor;

		const prEntity = {
			data: {
				html_url: "github.com/owner/repo/pull/456",
			},
			number: 456,
			type: "pull_request",
		} as PullRequestEntity;

		const closeReport = [
			{ about: fakeAbout, data: { ...fakeData, action: "close" as const } },
		] satisfies RuleReport[];

		beforeEach(() => {
			closeEntity.mockReset();
			mockSetCommentForReports.mockResolvedValue(fakeComment);
		});

		it("closes the PR when a report carries action: close on a pull_request entity", async () => {
			await outputActionReports(
				actorWithClose,
				prEntity,
				closeReport,
				settings,
			);

			expect(closeEntity).toHaveBeenCalledOnce();
		});

		it("does not close when no report carries action: close on a pull_request entity", async () => {
			await outputActionReports(actorWithClose, prEntity, reports, settings);

			expect(closeEntity).not.toHaveBeenCalled();
		});

		it("closes a non-pull_request entity when a report carries action: close", async () => {
			await outputActionReports(actorWithClose, entity, closeReport, settings);

			expect(closeEntity).toHaveBeenCalledOnce();
		});

		it("calls setFailed when closeEntity throws", async () => {
			closeEntity.mockRejectedValue(new Error("Permission denied"));

			await outputActionReports(
				actorWithClose,
				prEntity,
				closeReport,
				settings,
			);

			expect(mockCore.setFailed).toHaveBeenCalledWith(
				expect.stringContaining("Permission denied"),
			);
		});

		it("does not close the entity when comment posting fails", async () => {
			mockSetCommentForReports.mockRejectedValue(new Error("Network error"));

			await outputActionReports(
				actorWithClose,
				prEntity,
				closeReport,
				settings,
			);

			expect(closeEntity).not.toHaveBeenCalled();
		});
	});
});
