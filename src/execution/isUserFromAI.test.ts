import { describe, expect, it } from "vitest";

import { isUserFromAI } from "./isUserFromAI.ts";

describe("isUserFromAI", () => {
	it("returns true when the user is a known AI agent", () => {
		const actual = isUserFromAI({ login: "Copilot", type: "Bot" });

		expect(actual).toBe(true);
	});

	it("returns true when the user is a known AI agent with a [bot] login", () => {
		const actual = isUserFromAI({ login: "claude[bot]", type: "Bot" });

		expect(actual).toBe(true);
	});

	it("returns false when the user is a bot that is not a known AI agent", () => {
		const actual = isUserFromAI({ login: "dependabot[bot]", type: "Bot" });

		expect(actual).toBe(false);
	});

	it("returns false when the user has a known AI agent login but is a user", () => {
		const actual = isUserFromAI({ login: "Copilot", type: "User" });

		expect(actual).toBe(false);
	});

	it("returns false when the user has no type", () => {
		const actual = isUserFromAI({ login: "Copilot" });

		expect(actual).toBe(false);
	});
});
