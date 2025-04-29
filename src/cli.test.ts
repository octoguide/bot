import { describe, expect, it, vi } from "vitest";

import { cli } from "./cli.js";

const mockRunOctoGuideRules = vi.fn().mockResolvedValue({});

vi.mock("./runOctoGuideRules.js", () => ({
	get runOctoGuideRules() {
		return mockRunOctoGuideRules;
	},
}));

const mockCliReporter = vi.fn();

vi.mock("./reporters/cliReporter.js", () => ({
	get cliReporter() {
		return mockCliReporter;
	},
}));

describe(cli, () => {
	it("throws an error when no entity url is provided", async () => {
		await expect(() => cli()).rejects.toThrow(
			"Please provide a url, like 'npx octoguide github.com/...'",
		);
	});

	it("throws an error when an unknown config is provided", async () => {
		await expect(() =>
			cli("github.com/...", "--config", "other"),
		).rejects.toThrow("Unknown config provided: 'other'");
	});

	it("runs runOctoGuideRules when a config and entity url are provided", async () => {
		const config = "strict";
		const entity = "github.com/...";

		await cli(entity, "--config", config);

		expect(mockRunOctoGuideRules).toHaveBeenCalledWith({ config, entity });
		expect(mockCliReporter).toHaveBeenCalled();
	});
});
