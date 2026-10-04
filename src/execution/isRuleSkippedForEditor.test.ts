import { describe, expect, it } from "vitest";

import type { Entity, IssueData } from "../types/entities.js";

import { isRuleSkippedForEditor } from "./isRuleSkippedForEditor.js";

const bot = { login: "renovate[bot]", type: "Bot" };
const collaborator = { login: "collaborator", type: "User" };
const owner = { login: "owner", type: "User" };

const createIssueEntity = (user: { login: string; type: string }): Entity => ({
	data: { user } as IssueData,
	number: 1,
	type: "issue",
});

const entity = createIssueEntity({ login: "author", type: "User" });
const entityFromBot = createIssueEntity(bot);

describe("isRuleSkippedForEditor", () => {
	it("returns false when associations are not restricted", () => {
		const actual = isRuleSkippedForEditor(collaborator, entity, "owner", {
			"include-bots": false,
		});

		expect(actual).toBe(false);
	});

	it("returns true when a bot edits and bots are excluded", () => {
		const actual = isRuleSkippedForEditor(bot, entity, "owner", {
			"include-bots": false,
		});

		expect(actual).toBe(true);
	});

	it("returns false when a bot edits and bots are included, regardless of associations", () => {
		const actual = isRuleSkippedForEditor(bot, entity, "owner", {
			"include-associations": new Set(["CONTRIBUTOR"]),
			"include-bots": true,
		});

		expect(actual).toBe(false);
	});

	it("returns true when a user edits an entity from a bot and bots are excluded, even if the user is included", () => {
		const actual = isRuleSkippedForEditor(
			collaborator,
			entityFromBot,
			"owner",
			{
				"include-associations": new Set(["COLLABORATOR"]),
				"include-bots": false,
			},
		);

		expect(actual).toBe(true);
	});

	it("returns false when a user edits an entity from a bot, bots are included, and the user is included", () => {
		const actual = isRuleSkippedForEditor(
			collaborator,
			entityFromBot,
			"owner",
			{
				"include-associations": new Set(["COLLABORATOR"]),
				"include-bots": true,
			},
		);

		expect(actual).toBe(false);
	});

	it("returns true when a user edits an entity from a bot, bots are included, and the user is excluded", () => {
		const actual = isRuleSkippedForEditor(
			collaborator,
			entityFromBot,
			"owner",
			{
				"include-associations": new Set(["CONTRIBUTOR"]),
				"include-bots": true,
			},
		);

		expect(actual).toBe(true);
	});

	it("returns true when a non-owner edits and neither collaborators nor members are included", () => {
		const actual = isRuleSkippedForEditor(collaborator, entity, "owner", {
			"include-associations": new Set(["CONTRIBUTOR", "OWNER"]),
			"include-bots": false,
		});

		expect(actual).toBe(true);
	});

	it.each(["COLLABORATOR", "MEMBER"])(
		"returns false when a non-owner edits and %s is included",
		(association) => {
			const actual = isRuleSkippedForEditor(collaborator, entity, "owner", {
				"include-associations": new Set([association]),
				"include-bots": false,
			});

			expect(actual).toBe(false);
		},
	);

	it("returns true when the owner edits and owners are not included", () => {
		const actual = isRuleSkippedForEditor(owner, entity, "owner", {
			"include-associations": new Set(["COLLABORATOR", "MEMBER"]),
			"include-bots": false,
		});

		expect(actual).toBe(true);
	});

	it("returns false when the owner edits and owners are included", () => {
		const actual = isRuleSkippedForEditor(owner, entity, "owner", {
			"include-associations": new Set(["OWNER"]),
			"include-bots": false,
		});

		expect(actual).toBe(false);
	});
});
