import { beforeEach, describe, expect, it, vi } from "vitest";

import { collectAuth } from "./collectAuth.js";

const mockGetInput = vi.fn<(name: string) => string>();

vi.mock("@actions/core", () => ({
	get getInput() {
		return mockGetInput;
	},
}));

const originalEnv = { ...process.env };

beforeEach(() => {
	process.env = { ...originalEnv };
	mockGetInput.mockReturnValue("");
});

describe("collectAuth", () => {
	it("returns the input token when one is provided", () => {
		mockGetInput.mockReturnValue("input-token");
		process.env.GITHUB_TOKEN = "env-token";

		const actual = collectAuth();

		expect(actual).toBe("input-token");
	});

	it("returns the environment token when no input is provided", () => {
		process.env.GITHUB_TOKEN = "env-token";

		const actual = collectAuth();

		expect(actual).toBe("env-token");
	});

	it("throws an error when no token is available", () => {
		delete process.env.GITHUB_TOKEN;

		expect(() => collectAuth()).toThrow(
			"Please provide a with.github-token to OctoGuide/bot.",
		);
	});
});
