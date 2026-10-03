import { describe, expect, it } from "vitest";

import { isRuleSkippedForUser } from "./isRuleSkippedForUser.js";

const bot = { login: "dependabot[bot]", type: "Bot" };

describe("isRuleSkippedForUser", () => {
	it("returns true when the user is a bot and bots are excluded", () => {
		const actual = isRuleSkippedForUser(bot, { "include-bots": false });

		expect(actual).toBe(true);
	});

	it("returns false when the user is a bot and bots are included", () => {
		const actual = isRuleSkippedForUser(bot, { "include-bots": true });

		expect(actual).toBe(false);
	});

	it("returns false when the user has a bot-like login but is a user", () => {
		const actual = isRuleSkippedForUser(
			{ login: "my-bot-account", type: "User" },
			{ "include-bots": false },
		);

		expect(actual).toBe(false);
	});

	it("returns false when the user has no type", () => {
		const actual = isRuleSkippedForUser(
			{ login: "discussion-author" },
			{ "include-bots": false },
		);

		expect(actual).toBe(false);
	});
});
