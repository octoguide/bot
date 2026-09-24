import type { Octokit } from "octokit";

import { vi } from "vitest";

/**
 * Creates a mock Octokit instance with minimal required properties.
 * @returns Minimal Octokit mock that satisfies basic test requirements.
 */
export const createMockOctokit = () =>
	({
		auth: vi.fn(),
		graphql: vi.fn(),
		hook: {
			after: vi.fn(),
			before: vi.fn(),
			error: vi.fn(),
			wrap: vi.fn(),
		},
		log: {
			debug: vi.fn(),
			error: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
		},
		request: vi.fn(),
		rest: { issues: { get: vi.fn() } },
	}) as unknown as Octokit;
