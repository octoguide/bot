import { describe, expect, it } from "vitest";

import type { Entity, IssueData } from "../types/entities.js";
import type { RuleReport, RuleReportData } from "../types/reports.js";
import type { Settings } from "../types/settings.js";

import { prBodyDescriptive } from "../rules/prBodyDescriptive.js";
import { textImageAltText } from "../rules/textImageAltText.js";
import { attributeEditReports } from "./attributeEditReports.js";

const editor = { login: "collaborator", type: "User" };

const entity = {
	data: {
		author_association: "CONTRIBUTOR",
		html_url: "https://github.com/owner/repo/issues/1",
		user: { login: "author", type: "User" },
	} as IssueData,
	number: 1,
	type: "issue",
} satisfies Entity;

const createSettings = (includeAssociations: string[]): Settings => ({
	config: "none",
	options: { "include-associations": includeAssociations },
	rules: { "pr-body-descriptive": true, "text-image-alt-text": true },
});

const createReport = (
	data: Partial<RuleReportData> = {},
	about = prBodyDescriptive.about,
): RuleReport => ({
	about,
	data: { primary: "Violation.", suggestion: ["Fix it."], ...data },
});

describe("attributeEditReports", () => {
	it("attributes a report introduced by the edit to the editor when its rule includes them", () => {
		const report = createReport();

		const actual = attributeEditReports({
			editor,
			entity,
			previousReports: [],
			reports: [report],
			repositoryOwner: "owner",
			settings: createSettings(["COLLABORATOR"]),
		});

		expect(actual).toEqual({ logins: ["collaborator"], reports: [report] });
	});

	it("ignores a report introduced by the edit when its rule excludes the editor", () => {
		const actual = attributeEditReports({
			editor,
			entity,
			previousReports: [],
			reports: [createReport()],
			repositoryOwner: "owner",
			settings: createSettings(["CONTRIBUTOR"]),
		});

		expect(actual).toEqual({ logins: [], reports: [] });
	});

	it("attributes a report from before the edit to the author when its rule includes them", () => {
		const report = createReport();

		const actual = attributeEditReports({
			editor,
			entity,
			previousReports: [createReport()],
			reports: [report],
			repositoryOwner: "owner",
			settings: createSettings(["CONTRIBUTOR"]),
		});

		expect(actual).toEqual({ logins: ["author"], reports: [report] });
	});

	it("ignores a report from before the edit when its rule excludes the author", () => {
		const actual = attributeEditReports({
			editor,
			entity,
			previousReports: [createReport()],
			reports: [createReport()],
			repositoryOwner: "owner",
			settings: createSettings(["COLLABORATOR"]),
		});

		expect(actual).toEqual({ logins: [], reports: [] });
	});

	it("attributes a report to the author when its rule reported the same primary message with different details before the edit", () => {
		const report = createReport({ secondary: ["> Task two"] });

		const actual = attributeEditReports({
			editor,
			entity,
			previousReports: [
				createReport({ secondary: ["> Task one", "> Task two"] }),
			],
			reports: [report],
			repositoryOwner: "owner",
			settings: createSettings(["CONTRIBUTOR"]),
		});

		expect(actual).toEqual({ logins: ["author"], reports: [report] });
	});

	it("attributes a report to the editor when its rule only reported a different primary message before the edit", () => {
		const report = createReport({ primary: "Another violation." });

		const actual = attributeEditReports({
			editor,
			entity,
			previousReports: [createReport()],
			reports: [report],
			repositoryOwner: "owner",
			settings: createSettings(["COLLABORATOR"]),
		});

		expect(actual).toEqual({ logins: ["collaborator"], reports: [report] });
	});

	it("attributes a report to the editor when only a different rule reported the same message before the edit", () => {
		const report = createReport({}, textImageAltText.about);

		const actual = attributeEditReports({
			editor,
			entity,
			previousReports: [createReport()],
			reports: [report],
			repositoryOwner: "owner",
			settings: createSettings(["COLLABORATOR"]),
		});

		expect(actual).toEqual({ logins: ["collaborator"], reports: [report] });
	});

	it("matches reports to identical reports from before the edit before ones with only the same primary message", () => {
		const added = createReport({ secondary: ["> ![](added.png)"] });
		const existing = createReport({ secondary: ["> ![](existing.png)"] });

		const actual = attributeEditReports({
			editor,
			entity,
			previousReports: [createReport({ secondary: ["> ![](existing.png)"] })],
			reports: [added, existing],
			repositoryOwner: "owner",
			settings: createSettings(["CONTRIBUTOR"]),
		});

		expect(actual).toEqual({ logins: ["author"], reports: [existing] });
	});

	it("attributes each additional identical report to the editor", () => {
		const first = createReport();
		const second = createReport();

		const actual = attributeEditReports({
			editor,
			entity,
			previousReports: [createReport()],
			reports: [first, second],
			repositoryOwner: "owner",
			settings: createSettings(["COLLABORATOR"]),
		});

		expect(actual).toEqual({ logins: ["collaborator"], reports: [second] });
	});

	it("lists the author before the editor when both have kept reports", () => {
		const added = createReport({ primary: "New violation." });
		const existing = createReport();

		const actual = attributeEditReports({
			editor,
			entity,
			previousReports: [createReport()],
			reports: [added, existing],
			repositoryOwner: "owner",
			settings: createSettings(["COLLABORATOR", "CONTRIBUTOR"]),
		});

		expect(actual).toEqual({
			logins: ["author", "collaborator"],
			reports: [added, existing],
		});
	});

	it("keeps a report from before the edit without a login when the entity has no author", () => {
		const report = createReport();

		const actual = attributeEditReports({
			editor,
			entity: { ...entity, data: { ...entity.data, user: null } },
			previousReports: [createReport()],
			reports: [report],
			repositoryOwner: "owner",
			settings: createSettings(["CONTRIBUTOR"]),
		});

		expect(actual).toEqual({ logins: [], reports: [report] });
	});

	it("checks the repository owner as an OWNER editor", () => {
		const report = createReport();

		const actual = attributeEditReports({
			editor: { login: "owner", type: "User" },
			entity,
			previousReports: [],
			reports: [report],
			repositoryOwner: "owner",
			settings: createSettings(["OWNER"]),
		});

		expect(actual).toEqual({ logins: ["owner"], reports: [report] });
	});

	it("ignores a report from a rule that isn't enabled", () => {
		const actual = attributeEditReports({
			editor,
			entity,
			previousReports: [],
			reports: [createReport({}, { ...prBodyDescriptive.about, name: "x" })],
			repositoryOwner: "owner",
			settings: createSettings(["COLLABORATOR"]),
		});

		expect(actual).toEqual({ logins: [], reports: [] });
	});
});
