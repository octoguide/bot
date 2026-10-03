import type { PartialDeep } from "type-fest";

import { describe, expect, it } from "vitest";

import type { Entity, IssueData } from "../types/entities.js";

import { isEntityFromAI } from "./isEntityFromAI.js";

const createIssueEntity = (data: PartialDeep<IssueData>): Entity => ({
	data: data as IssueData,
	number: 1,
	type: "issue",
});

describe("isEntityFromAI", () => {
	it("returns true when the entity's user is a known AI agent", () => {
		const actual = isEntityFromAI(
			createIssueEntity({ user: { login: "Copilot", type: "Bot" } }),
		);

		expect(actual).toBe(true);
	});

	it("returns true when the entity's user is a known AI agent with a [bot] login", () => {
		const actual = isEntityFromAI(
			createIssueEntity({ user: { login: "claude[bot]", type: "Bot" } }),
		);

		expect(actual).toBe(true);
	});

	it("returns false when the entity's user is a bot that is not a known AI agent", () => {
		const actual = isEntityFromAI(
			createIssueEntity({ user: { login: "dependabot[bot]", type: "Bot" } }),
		);

		expect(actual).toBe(false);
	});

	it("returns false when the entity's user has a known AI agent login but is a user", () => {
		const actual = isEntityFromAI(
			createIssueEntity({ user: { login: "Copilot", type: "User" } }),
		);

		expect(actual).toBe(false);
	});

	it("returns false when the entity has no user", () => {
		const actual = isEntityFromAI(createIssueEntity({ user: null }));

		expect(actual).toBe(false);
	});
});
