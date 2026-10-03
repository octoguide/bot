import { describe, expect, it } from "vitest";

import { isRuleSkippedForEditor } from "./isRuleSkippedForEditor.js";

const bot = { login: "renovate[bot]", type: "Bot" };
const collaborator = { login: "collaborator", type: "User" };
const owner = { login: "owner", type: "User" };

describe("isRuleSkippedForEditor", () => {
	it("returns false when associations are not restricted", () => {
		const actual = isRuleSkippedForEditor(collaborator, "owner", {
			"include-bots": false,
		});

		expect(actual).toBe(false);
	});

	it("returns true when a bot edits and bots are excluded", () => {
		const actual = isRuleSkippedForEditor(bot, "owner", {
			"include-bots": false,
		});

		expect(actual).toBe(true);
	});

	it("returns false when a bot edits and bots are included, regardless of associations", () => {
		const actual = isRuleSkippedForEditor(bot, "owner", {
			"include-associations": new Set(["CONTRIBUTOR"]),
			"include-bots": true,
		});

		expect(actual).toBe(false);
	});

	it("returns true when a non-owner edits and neither collaborators nor members are included", () => {
		const actual = isRuleSkippedForEditor(collaborator, "owner", {
			"include-associations": new Set(["CONTRIBUTOR", "OWNER"]),
			"include-bots": false,
		});

		expect(actual).toBe(true);
	});

	it.each(["COLLABORATOR", "MEMBER"])(
		"returns false when a non-owner edits and %s is included",
		(association) => {
			const actual = isRuleSkippedForEditor(collaborator, "owner", {
				"include-associations": new Set([association]),
				"include-bots": false,
			});

			expect(actual).toBe(false);
		},
	);

	it("returns true when the owner edits and owners are not included", () => {
		const actual = isRuleSkippedForEditor(owner, "owner", {
			"include-associations": new Set(["COLLABORATOR", "MEMBER"]),
			"include-bots": false,
		});

		expect(actual).toBe(true);
	});

	it("returns false when the owner edits and owners are included", () => {
		const actual = isRuleSkippedForEditor(owner, "owner", {
			"include-associations": new Set(["OWNER"]),
			"include-bots": false,
		});

		expect(actual).toBe(false);
	});
});
