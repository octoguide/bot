import { describe, expect, it } from "vitest";

import { parseRules } from "./parseRules.js";

describe("parseRules", () => {
	it("returns no rules when given an empty string", () => {
		const actual = parseRules("");

		expect(actual).toEqual({});
	});

	it("returns parsed rules when given a JSON object", () => {
		const actual = parseRules(
			`{"comment-meaningful": false, "text-image-alt-text": {"include-bots": true}}`,
		);

		expect(actual).toEqual({
			"comment-meaningful": false,
			"text-image-alt-text": { "include-bots": true },
		});
	});

	it("returns an error when given invalid JSON", () => {
		const actual = parseRules("{invalid json}");

		expect(actual).toBeInstanceOf(Error);
	});
});
