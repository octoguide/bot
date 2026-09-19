import type { PartialDeep } from "type-fest";

import { describe, expect, it } from "vitest";

import type { Entity, IssueData } from "../types/entities.js";

import { isRuleSkippedForEntity } from "./isRuleSkippedForEntity.js";

const createIssueEntity = (data: PartialDeep<IssueData>): Entity => ({
	data: data as IssueData,
	number: 1,
	type: "issue",
});

describe("isRuleSkippedForEntity", () => {
	it("returns false when the entity matches the options", () => {
		const actual = isRuleSkippedForEntity(
			createIssueEntity({
				author_association: "CONTRIBUTOR",
				user: { login: "test-user", type: "User" },
			}),
			{
				"include-associations": new Set(["CONTRIBUTOR"]),
				"include-bots": false,
			},
		);

		expect(actual).toBe(false);
	});

	it("returns true when the entity's association is not included", () => {
		const actual = isRuleSkippedForEntity(
			createIssueEntity({ author_association: "OWNER" }),
			{
				"include-associations": new Set(["CONTRIBUTOR"]),
				"include-bots": true,
			},
		);

		expect(actual).toBe(true);
	});

	it("returns true when the entity is from a bot and bots are excluded", () => {
		const actual = isRuleSkippedForEntity(
			createIssueEntity({ user: { login: "dependabot[bot]", type: "Bot" } }),
			{ "include-bots": false },
		);

		expect(actual).toBe(true);
	});

	it("returns false when the entity is from a bot and bots are included", () => {
		const actual = isRuleSkippedForEntity(
			createIssueEntity({ user: { login: "dependabot[bot]", type: "Bot" } }),
			{ "include-bots": true },
		);

		expect(actual).toBe(false);
	});
});
