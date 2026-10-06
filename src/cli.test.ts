import { afterEach, describe, expect, it, vi } from "vitest";

import { cli, octoguideCli } from "./cli.js";

const mockRunOctoGuideRules = vi.fn().mockResolvedValue({});

vi.mock("./runOctoGuideRules.js", () => ({
	get runOctoGuideRules() {
		return mockRunOctoGuideRules;
	},
}));

const mockResolveEntityUrl = vi.fn();

vi.mock("./resolveEntityUrl.js", () => ({
	get resolveEntityUrl() {
		return mockResolveEntityUrl;
	},
}));

const mockCliReporter = vi.fn();

vi.mock("./reporters/cliReporter.js", () => ({
	get cliReporter() {
		return mockCliReporter;
	},
}));

function spyOnConsole() {
	return {
		error: vi.spyOn(console, "error").mockImplementation(() => undefined),
		log: vi.spyOn(console, "log").mockImplementation(() => undefined),
	};
}

describe(cli, () => {
	afterEach(() => {
		process.exitCode = undefined;
		vi.restoreAllMocks();
	});

	it("prints an error and sets exitCode when no entity url is provided", async () => {
		const console = spyOnConsole();

		const actual = await cli();

		expect(actual).toBeUndefined();
		expect(console.error).toHaveBeenCalledWith(
			[
				"Arguments: Please provide a url, like 'npx octoguide github.com/...'",
				"Run 'octoguide --help' for usage.",
			].join("\n"),
		);
		expect(process.exitCode).toBe(1);
		expect(mockRunOctoGuideRules).not.toHaveBeenCalled();
	});

	it("prints an error listing valid configs when an unknown config is provided", async () => {
		const console = spyOnConsole();

		const actual = await cli("github.com/...", "--config", "other");

		expect(actual).toBeUndefined();
		expect(console.error).toHaveBeenCalledWith(
			[
				"--config: Unknown config provided: 'other' (expected one of: none, recommended, strict).",
				"Run 'octoguide --help' for usage.",
			].join("\n"),
		);
		expect(process.exitCode).toBe(1);
		expect(mockRunOctoGuideRules).not.toHaveBeenCalled();
	});

	it("prints an error with a suggestion when an unknown flag is provided", async () => {
		const console = spyOnConsole();

		const actual = await cli("github.com/...", "--configs", "strict");

		expect(actual).toBeUndefined();
		expect(console.error).toHaveBeenCalledWith(
			[
				"Unknown flag: --configs (did you mean --config?)",
				"Run 'octoguide --help' for usage.",
			].join("\n"),
		);
		expect(process.exitCode).toBe(1);
		expect(mockRunOctoGuideRules).not.toHaveBeenCalled();
	});

	it("prints help text when --help is provided", async () => {
		const console = spyOnConsole();

		const actual = await cli("--help");

		expect(actual).toBeUndefined();
		expect(console.log).toHaveBeenCalledWith(octoguideCli.formatHelp());
		expect(process.exitCode).toBeUndefined();
		expect(mockRunOctoGuideRules).not.toHaveBeenCalled();
	});

	it("runs runOctoGuideRules with the resolved entity url when a config and entity url are provided", async () => {
		const config = "strict";
		const entity = "https://github.com/...";
		const output = "Found 0 reports. Great! ✅";

		mockResolveEntityUrl.mockResolvedValueOnce(entity);
		mockCliReporter.mockReturnValueOnce(output);

		const actual = await cli("...", "--config", config);

		expect(actual).toBe(output);
		expect(mockResolveEntityUrl).toHaveBeenCalledWith("...");
		expect(mockRunOctoGuideRules).toHaveBeenCalledWith({
			entity,
			settings: { config },
		});
		expect(mockCliReporter).toHaveBeenCalled();
	});

	it("runs runOctoGuideRules without a config when no config is provided", async () => {
		const entity = "https://github.com/...";

		mockResolveEntityUrl.mockResolvedValueOnce(entity);

		await cli("...");

		expect(mockRunOctoGuideRules).toHaveBeenCalledWith({
			entity,
			settings: { config: undefined },
		});
	});
});

describe("octoguideCli", () => {
	it("formats help text", () => {
		expect(octoguideCli.formatHelp()).toMatchInlineSnapshot(`
			"Usage: octoguide [options] <url>

			Previews the reports OctoGuide would post for a GitHub contribution.

			Options:
			      --config <none|recommended|strict>  Which preset config to use (default: recommended)
			  -h, --help                              Show this help message

			Examples:
			  npx octoguide https://github.com/OctoGuide/bot/issues/19
			  npx octoguide OctoGuide/bot/issues/19 --config strict

			Docs: https://octo.guide/cli"
		`);
	});
});
