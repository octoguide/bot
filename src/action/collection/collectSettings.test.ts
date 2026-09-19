import { beforeEach, describe, expect, it, vi } from "vitest";

import { collectSettings } from "./collectSettings.js";

const defaultFooter =
	"🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices.";

const mockGetInput = vi.fn<(name: string) => string>();

vi.mock("@actions/core", () => ({
	get getInput() {
		return mockGetInput;
	},
}));

const mockInputs = (inputs: Record<string, string> = {}) => {
	mockGetInput.mockImplementation((name) => inputs[name] ?? "");
};

beforeEach(() => {
	mockInputs();
});

describe("collectSettings", () => {
	it("returns default settings when no inputs are provided", () => {
		const actual = collectSettings();

		expect(actual).toEqual({
			comments: { footer: defaultFooter, header: "" },
			config: "recommended",
			options: {
				"include-associations": [],
				"include-bots": false,
			},
			rules: {},
		});
	});

	it("throws an error when an unknown config is provided", () => {
		mockInputs({ config: "unknown-config" });

		expect(() => collectSettings()).toThrow(
			"Unknown config provided: unknown-config",
		);
	});

	it("throws an error when the rules input is invalid JSON", () => {
		mockInputs({ rules: "{invalid json}" });

		expect(() => collectSettings()).toThrow('Could not parse "rules" input:');
	});

	it("returns customized settings when inputs are provided", () => {
		mockInputs({
			"comment-footer": "Custom footer!",
			"comment-header": "Custom header!",
			config: "strict",
			"include-associations": "MEMBER, OWNER",
			"include-bots": "true",
			rules: `{"comment-meaningful": false}`,
		});

		const actual = collectSettings();

		expect(actual).toEqual({
			comments: { footer: "Custom footer!", header: "Custom header!" },
			config: "strict",
			options: {
				"include-associations": ["MEMBER", "OWNER"],
				"include-bots": true,
			},
			rules: { "comment-meaningful": false },
		});
	});
});
