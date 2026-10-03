import { describe, expect, it } from "vitest";

import { mergeRuleOptions } from "./mergeRuleOptions.js";

describe("mergeRuleOptions", () => {
	it("returns permissive defaults when given no layers", () => {
		const actual = mergeRuleOptions();

		expect(actual).toEqual({
			"include-associations": undefined,
			"include-bots": true,
		});
	});

	it("adds NONE to associations when a layer provides associations", () => {
		const actual = mergeRuleOptions({ "include-associations": ["MEMBER"] });

		expect(actual).toEqual({
			"include-associations": new Set(["MEMBER", "NONE"]),
			"include-bots": true,
		});
	});

	it("prefers later layers when multiple layers provide an option", () => {
		const actual = mergeRuleOptions(
			{ "include-associations": ["MEMBER"], "include-bots": false },
			{ "include-associations": ["OWNER"] },
		);

		expect(actual).toEqual({
			"include-associations": new Set(["NONE", "OWNER"]),
			"include-bots": false,
		});
	});

	it("keeps earlier layers when a later layer omits an option", () => {
		const actual = mergeRuleOptions(
			{ "include-associations": ["MEMBER"] },
			{ "include-associations": undefined, "include-bots": false },
			undefined,
		);

		expect(actual).toEqual({
			"include-associations": new Set(["MEMBER", "NONE"]),
			"include-bots": false,
		});
	});

	it("passes through options unknown to the merger", () => {
		const actual = mergeRuleOptions({ labels: ["bug"] });

		expect(actual).toEqual({
			"include-associations": undefined,
			"include-bots": true,
			labels: ["bug"],
		});
	});
});
