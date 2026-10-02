import { describe, expect, it, vi } from "vitest";

import { cli } from "./cli.js";

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

	it("runs runOctoGuideRules with the resolved entity url when a config and entity url are provided", async () => {
		const config = "strict";
		const entity = "https://github.com/...";

		mockResolveEntityUrl.mockResolvedValueOnce(entity);

		await cli("...", "--config", config);

		expect(mockRunOctoGuideRules).toHaveBeenCalledWith({
			entity,
			settings: { config },
		});
		expect(mockCliReporter).toHaveBeenCalled();
	});
});
