import { describe, expect, it } from "vitest";

import { parseIncludeAssociations } from "./parseIncludeAssociations.js";

describe("parseIncludeAssociations", () => {
	it("returns an empty list when given an empty string", () => {
		const actual = parseIncludeAssociations("");

		expect(actual).toEqual([]);
	});

	it("returns trimmed associations when given a comma-separated list", () => {
		const actual = parseIncludeAssociations(" MEMBER , OWNER ");

		expect(actual).toEqual(["MEMBER", "OWNER"]);
	});

	it("omits empty entries when the list contains extra commas", () => {
		const actual = parseIncludeAssociations("MEMBER,,OWNER,");

		expect(actual).toEqual(["MEMBER", "OWNER"]);
	});
});
