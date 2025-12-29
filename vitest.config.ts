import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			all: true,
			include: ["src"],
			reporter: ["html", "lcov"],
		},
		projects: [
			{
				test: {
					clearMocks: true,
					exclude: ["lib", "node_modules", "site"],
					name: "octoguide",
					setupFiles: ["console-fail-test/setup"],
				},
			},
			{
				test: {
					include: ["site/**/*.test.{js,ts}"],
					name: "site",
				},
			},
		],
	},
});
