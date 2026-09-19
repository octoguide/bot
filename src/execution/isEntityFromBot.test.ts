import type { PartialDeep } from "type-fest";

import { describe, expect, it } from "vitest";

import type { Entity, IssueData } from "../types/entities.js";

import { isEntityFromBot } from "./isEntityFromBot.js";

const createIssueEntity = (data: PartialDeep<IssueData>): Entity => ({
	data: data as IssueData,
	number: 1,
	type: "issue",
});

describe("isEntityFromBot", () => {
	it("returns true when the entity's user is a bot", () => {
		const actual = isEntityFromBot(
			createIssueEntity({ user: { login: "dependabot[bot]", type: "Bot" } }),
		);

		expect(actual).toBe(true);
	});

	it("returns false when the entity's user has a bot-like login but is a user", () => {
		const actual = isEntityFromBot(
			createIssueEntity({ user: { login: "my-bot-account", type: "User" } }),
		);

		expect(actual).toBe(false);
	});

	it("returns false when the entity has no user", () => {
		const actual = isEntityFromBot(createIssueEntity({ user: null }));

		expect(actual).toBe(false);
	});
});
