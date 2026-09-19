import type { PartialDeep } from "type-fest";

import { describe, expect, it } from "vitest";

import type { Entity, IssueData } from "../types/entities.js";

import { isEntityAssociationIncluded } from "./isEntityAssociationIncluded.js";

const createIssueEntity = (data: PartialDeep<IssueData>): Entity => ({
	data: data as IssueData,
	number: 1,
	type: "issue",
});

describe("isEntityAssociationIncluded", () => {
	it("returns true when no associations are specified", () => {
		const actual = isEntityAssociationIncluded(
			createIssueEntity({ author_association: "OWNER" }),
			undefined,
		);

		expect(actual).toBe(true);
	});

	it("returns true when the entity's association is included", () => {
		const actual = isEntityAssociationIncluded(
			createIssueEntity({ author_association: "CONTRIBUTOR" }),
			new Set(["CONTRIBUTOR"]),
		);

		expect(actual).toBe(true);
	});

	it("returns false when the entity's association is not included", () => {
		const actual = isEntityAssociationIncluded(
			createIssueEntity({ author_association: "OWNER" }),
			new Set(["CONTRIBUTOR"]),
		);

		expect(actual).toBe(false);
	});

	it("returns true when the entity has no association", () => {
		const actual = isEntityAssociationIncluded(
			{
				data: {
					body: "",
					html_url: "https://github.com/test/repo/discussions/1",
					number: 1,
					title: "",
					user: { login: "test-user" },
				},
				number: 1,
				type: "discussion",
			},
			new Set(["CONTRIBUTOR"]),
		);

		expect(actual).toBe(true);
	});
});
