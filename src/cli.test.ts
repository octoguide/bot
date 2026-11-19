import { afterEach, describe, expect, it, vi } from "vitest";

import { cli } from "./cli.ts";

const mockRunOctoGuideRules = vi.fn().mockResolvedValue({});

vi.mock("./runOctoGuideRules.ts", () => ({
	get runOctoGuideRules() {
		return mockRunOctoGuideRules;
	},
}));

const mockResolveEntityUrl = vi.fn();

vi.mock("./resolveEntityUrl.ts", () => ({
	get resolveEntityUrl() {
		return mockResolveEntityUrl;
	},
}));

const mockCliReporter = vi.fn();

vi.mock("./reporters/cliReporter.ts", () => ({
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
		const spies = spyOnConsole();

		await cli();

		expect(spies.error).toHaveBeenCalledWith(
			[
				"Please provide a url, like 'npx octoguide github.com/...'",
				"Run 'octoguide --help' for usage.",
			].join("\n"),
		);
		expect(process.exitCode).toBe(1);
		expect(mockRunOctoGuideRules).not.toHaveBeenCalled();
	});

	it("prints an error listing valid configs when an unknown config is provided", async () => {
		const spies = spyOnConsole();

		await cli("github.com/...", "--config", "other");

		expect(spies.error).toHaveBeenCalledWith(
			[
				'--config: Expected "none", "recommended", or "strict", received "other".',
				"Run 'octoguide --help' for usage.",
			].join("\n"),
		);
		expect(process.exitCode).toBe(1);
		expect(mockRunOctoGuideRules).not.toHaveBeenCalled();
	});

	it("prints an error with a suggestion when an unknown flag is provided", async () => {
		const spies = spyOnConsole();

		await cli("github.com/...", "--configs", "strict");

		expect(spies.error).toHaveBeenCalledWith(
			[
				"Unknown flag: --configs (did you mean --config?)",
				"Run 'octoguide --help' for usage.",
			].join("\n"),
		);
		expect(process.exitCode).toBe(1);
		expect(mockRunOctoGuideRules).not.toHaveBeenCalled();
	});

	it("runs runOctoGuideRules with the resolved entity url when a config and entity url are provided", async () => {
		const config = "strict";
		const entity = "https://github.com/...";
		const output = "Found 0 reports. Great! ✅";

		mockResolveEntityUrl.mockResolvedValueOnce(entity);
		mockCliReporter.mockReturnValueOnce(output);
		const spies = spyOnConsole();

		await cli("...", "--config", config);

		expect(mockResolveEntityUrl).toHaveBeenCalledWith("...");
		expect(mockRunOctoGuideRules).toHaveBeenCalledWith({
			entity,
			settings: { config },
		});
		expect(spies.log).toHaveBeenCalledWith(output);
	});

	it("runs runOctoGuideRules without a config when no config is provided", async () => {
		const entity = "https://github.com/...";

		mockResolveEntityUrl.mockResolvedValueOnce(entity);
		spyOnConsole();

		await cli("...");

		expect(mockRunOctoGuideRules).toHaveBeenCalledWith({
			entity,
			settings: { config: undefined },
		});
	});

	it("prints help text when --help is provided", async () => {
		const spies = spyOnConsole();

		await cli("--help");

		expect(spies.log.mock.calls[0][0]).toMatchInlineSnapshot(`
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
		expect(process.exitCode).toBeUndefined();
		expect(mockRunOctoGuideRules).not.toHaveBeenCalled();
	});
});
