import { describe, expect, it } from "vitest";

import { configs } from "../rules/configs.js";
import { textImageAltText } from "../rules/textImageAltText.js";
import { resolveRules } from "./resolveRules.js";

const resolveRuleNames = (...parameters: Parameters<typeof resolveRules>) =>
	resolveRules(...parameters).map(({ rule }) => rule.about.name);

const resolveRuleOptions = (
	name: string,
	...parameters: Parameters<typeof resolveRules>
) =>
	resolveRules(...parameters).find(({ rule }) => rule.about.name === name)
		?.options;

describe("resolveRules", () => {
	it("resolves the recommended config when no settings are provided", () => {
		const actual = resolveRuleNames();

		expect(actual).toEqual(configs.recommended.map((rule) => rule.about.name));
	});

	it("resolves no rules when the none config is provided", () => {
		const actual = resolveRuleNames({ config: "none" });

		expect(actual).toEqual([]);
	});

	it("resolves the strict config when the strict config is provided", () => {
		const actual = resolveRuleNames({ config: "strict" });

		expect(actual).toEqual(configs.strict.map((rule) => rule.about.name));
	});

	it("excludes a config rule when it is disabled in settings", () => {
		const actual = resolveRuleNames({ rules: { "comment-meaningful": false } });

		expect(actual).not.toContain("comment-meaningful");
	});

	it("includes a rule outside the config when it is enabled in settings", () => {
		const actual = resolveRuleNames({ rules: { "pr-linked-issue": true } });

		expect(actual).toContain("pr-linked-issue");
	});

	it("includes a rule outside the config when it is given options in settings", () => {
		const actual = resolveRuleNames({
			rules: { "pr-linked-issue": { "include-bots": true } },
		});

		expect(actual).toContain("pr-linked-issue");
	});

	it("applies global options to a rule without its own default options", () => {
		const actual = resolveRuleOptions("comment-meaningful", {
			options: { "include-associations": ["MEMBER"], "include-bots": false },
		});

		expect(actual).toEqual({
			"include-associations": new Set(["MEMBER", "NONE"]),
			"include-bots": false,
		});
	});

	it("prefers a rule's default options over global options", () => {
		const actual = resolveRuleOptions("text-image-alt-text", {
			options: { "include-associations": ["MEMBER"] },
		});

		expect(actual?.["include-associations"]).toEqual(
			new Set([
				"NONE",
				...(textImageAltText.about.defaultOptions?.["include-associations"] ??
					[]),
			]),
		);
	});

	it("keeps bots included for pr-automation-detected when global options exclude bots", () => {
		const actual = resolveRuleOptions("pr-automation-detected", {
			options: { "include-bots": false },
		});

		expect(actual?.["include-bots"]).toBe(true);
	});

	it("prefers per-rule options over a rule's default options", () => {
		const actual = resolveRuleOptions("text-image-alt-text", {
			rules: { "text-image-alt-text": { "include-associations": ["MEMBER"] } },
		});

		expect(actual?.["include-associations"]).toEqual(
			new Set(["MEMBER", "NONE"]),
		);
	});
});
