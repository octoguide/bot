import { beforeEach, describe, expect, it, vi } from "vitest";

import { collectTarget } from "./collectTarget.js";

const mockCore = {
	debug: vi.fn(),
	info: vi.fn(),
};

vi.mock("@actions/core", () => ({
	get debug() {
		return mockCore.debug;
	},
	get info() {
		return mockCore.info;
	},
}));

const url = "https://github.com/test/repo/issues/1";

beforeEach(() => {
	vi.clearAllMocks();
});

describe("collectTarget", () => {
	it("returns nothing when the payload has no action", () => {
		const actual = collectTarget({});

		expect(actual).toEqual({});
		expect(mockCore.info).toHaveBeenCalledWith(
			"Unknown payload action. Exiting.",
		);
	});

	it("throws an error when the payload has no entity", () => {
		expect(() => collectTarget({ action: "opened" })).toThrow(
			"Could not determine an entity to run OctoGuide/bot on.",
		);
	});

	it("throws an error when the entity has no html_url", () => {
		expect(() =>
			collectTarget({ action: "opened", issue: { number: 1 } }),
		).toThrow("Target entity's html_url is not a string.");
	});

	it("returns the comment when the payload contains one", () => {
		const comment = { html_url: url, id: 1 };

		const actual = collectTarget({
			action: "created",
			comment,
			issue: { html_url: url, number: 1 },
		});

		expect(actual).toEqual({ target: comment, url });
	});

	it("returns the issue when the payload contains one", () => {
		const issue = { html_url: url, number: 1 };

		const actual = collectTarget({ action: "opened", issue });

		expect(actual).toEqual({ target: issue, url });
	});
});
