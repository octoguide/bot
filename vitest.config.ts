import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		clearMocks: true,
		coverage: {
			all: true,
			include: ["src"],
			reporter: ["html", "lcov"],
		},
		projects: [
			{
				test: {
					exclude: ["lib", "node_modules", "site"],
					name: "octoguide",
				},
			},
			{
				test: {
					include: ["site/**/*.test.{js,ts}"],
					name: "site",
				},
			},
		],
		setupFiles: ["console-fail-test/setup"],
	},
});
