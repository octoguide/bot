import { describe, expect, it } from "vitest";

import { isRuleSkippedForUser } from "./isRuleSkippedForUser.ts";

const ai = { login: "Copilot", type: "Bot" };
const bot = { login: "dependabot[bot]", type: "Bot" };

describe("isRuleSkippedForUser", () => {
	it("returns true when the user is a bot and bots are excluded", () => {
		const actual = isRuleSkippedForUser(bot, {
			"include-ais": false,
			"include-bots": false,
		});

		expect(actual).toBe(true);
	});

	it("returns false when the user is a bot and bots are included", () => {
		const actual = isRuleSkippedForUser(bot, {
			"include-ais": true,
			"include-bots": true,
		});

		expect(actual).toBe(false);
	});

	it("returns false when the user has a bot-like login but is a user", () => {
		const actual = isRuleSkippedForUser(
			{ login: "my-bot-account", type: "User" },
			{ "include-ais": false, "include-bots": false },
		);

		expect(actual).toBe(false);
	});

	it("returns false when the user has no type", () => {
		const actual = isRuleSkippedForUser(
			{ login: "discussion-author" },
			{ "include-ais": false, "include-bots": false },
		);

		expect(actual).toBe(false);
	});

	it("returns true when the user is an AI agent and AI agents are excluded, even if bots are included", () => {
		const actual = isRuleSkippedForUser(ai, {
			"include-ais": false,
			"include-bots": true,
		});

		expect(actual).toBe(true);
	});

	it("returns false when the user is an AI agent and AI agents are included, even if bots are excluded", () => {
		const actual = isRuleSkippedForUser(ai, {
			"include-ais": true,
			"include-bots": false,
		});

		expect(actual).toBe(false);
	});
});
