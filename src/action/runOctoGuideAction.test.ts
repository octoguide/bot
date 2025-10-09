import type * as github from "@actions/github";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { EntityActor } from "../actors/types.js";
import type { RunOctoGuideRulesResult } from "../runOctoGuideRules.js";
import type { CommentData, Entity, IssueEntity } from "../types/entities.js";
import type { RuleReport } from "../types/reports.js";

import { runOctoGuideAction } from "./runOctoGuideAction";

const TEST_GITHUB_URL = "https://github.com/test/repo/issues/1";
const TEST_GITHUB_TOKEN = "mock-token";
const DEFAULT_REPORT_COUNT = 2;

const mockCore = {
	debug: vi.fn(),
	getInput: vi.fn().mockReturnValue(""),
	info: vi.fn(),
};

// Mock functions used directly in test assertions
const mockRunOctoGuideRules = vi
	.fn()
	.mockResolvedValue({} as RunOctoGuideRulesResult);
const mockCliReporter = vi.fn().mockReturnValue("");
const mockRunCommentCleanup = vi.fn().mockResolvedValue(undefined);
const mockOutputActionReports = vi.fn().mockResolvedValue(undefined);

vi.mock("@actions/core", () => ({
	get debug() {
		return mockCore.debug;
	},
	get getInput() {
		return mockCore.getInput;
	},
	get info() {
		return mockCore.info;
	},
}));

vi.mock("../index.js", () => ({
	get runOctoGuideRules() {
		return mockRunOctoGuideRules;
	},
}));

vi.mock("../reporters/cliReporter.js", () => ({
	get cliReporter() {
		return mockCliReporter;
	},
}));

vi.mock("./runCommentCleanup.js", () => ({
	get runCommentCleanup() {
		return mockRunCommentCleanup;
	},
}));

vi.mock("./comments/outputActionReports.js", () => ({
	get outputActionReports() {
		return mockOutputActionReports;
	},
}));

/**
 * Creates a mock Entity object for testing purposes.
 * @param dataOverrides Partial overrides for the entity's data property
 * @returns Complete Entity mock with realistic defaults
 * @example
 * ```typescript
 * const entity = createMockEntity({ html_url: "https://github.com/owner/repo/issues/456" });
 * ```
 */
const createMockEntity = (
	dataOverrides: Partial<{ html_url: string }> = {},
): Entity => {
	const mockData = {
		html_url: TEST_GITHUB_URL,
		...dataOverrides,
	} satisfies Pick<IssueEntity["data"], "html_url">;

	return {
		data: mockData as IssueEntity["data"],
		number: 1,
		type: "issue",
	} satisfies Entity;
};

/**
 * Creates a mock EntityActor with all required methods stubbed as vi.fn().
 * @returns EntityActor mock with realistic method signatures
 * @example
 * ```typescript
 * const actor = createMockActor();
 * actor.createComment.mockResolvedValue({ id: 123 });
 * ```
 */
const createMockActor = (): EntityActor =>
	({
		createComment: vi.fn<(body: string) => Promise<string>>(),
		getData: vi.fn<() => Promise<Entity["data"]>>(),
		listComments: vi.fn<() => Promise<CommentData[]>>(),
		metadata: {
			number: 1,
			type: "issue",
		} as Omit<IssueEntity, "data">,
		minimizeComment:
			vi.fn<(nodeId: string, reason?: "RESOLVED") => Promise<boolean>>(),
		unminimizeComment: vi.fn<(nodeId: string) => Promise<boolean>>(),
		updateComment: vi.fn<(number: number, newBody: string) => Promise<void>>(),
	}) satisfies EntityActor;

/**
 * Creates a mock GitHub webhook payload with sensible defaults.
 * Simulates the structure of GitHub webhook payloads for various events.
 * @param overrides Partial overrides to customize specific payload properties
 * @returns GitHub context payload mock
 * @example
 * ```typescript
 * const payload = createMockPayload({ action: "closed", issue: { number: 42 } });
 * ```
 */
const createMockPayload = (
	overrides: Partial<typeof github.context.payload> = {},
): typeof github.context.payload => ({
	action: "opened",
	issue: { html_url: TEST_GITHUB_URL, number: 1 },
	...overrides,
});

/**
 * Creates a minimal GitHub context mock for testing GitHub Actions.
 * Only includes essential properties required by the implementation.
 * @param payload The webhook payload to include in the context
 * @returns GitHub context mock with minimal required properties
 * @example
 * ```typescript
 * const context = createMockContext(createMockPayload({ action: "edited" }));
 * ```
 */
const createMockContext = (payload: typeof github.context.payload) => {
	return {
		eventName: "issue" as const,
		payload,
		repo: { owner: "owner", repo: "repo" },
	} satisfies Partial<typeof github.context> as typeof github.context;
};

/**
 * Sets up mock implementations for GitHub Action inputs.
 * Simulates the behavior of `@actions/core.getInput()` for workflow inputs.
 * @param overrides Key-value pairs of input names and their mock values
 * @example
 * ```typescript
 * createMockActionInputs({
 *   config: "strict",
 *   "github-token": "ghp_test123"
 * });
 * ```
 */
const createMockActionInputs = (overrides: Record<string, string> = {}) => {
	const inputs: Record<string, string> = {
		config: "recommended",
		"github-token": TEST_GITHUB_TOKEN,
		...overrides,
	};

	mockCore.getInput.mockImplementation((name: string) => inputs[name] ?? "");
};

/**
 * Sets up a successful rule execution mock with no reports found.
 * Useful for testing happy path scenarios where no violations are detected.
 * @returns The mock result object that will be returned by runOctoGuideRules
 * @example
 * ```typescript
 * const result = createMinimalRuleExecution();
 * // result.reports will be an empty array
 * ```
 */
const createMinimalRuleExecution = () => {
	const actor = createMockActor();
	(actor.listComments as ReturnType<typeof vi.fn>).mockResolvedValue([]);

	const mockResult = {
		actor,
		entity: createMockEntity(),
		reports: [],
	};
	mockRunOctoGuideRules.mockResolvedValueOnce(mockResult);
	return mockResult;
};

/**
 * Sets up a rule execution mock that returns a specified number of violation reports.
 * Useful for testing scenarios where rule violations are detected and need to be handled.
 * @param reportCount Number of mock reports to generate (default: 2)
 * @returns The mock result object containing the generated reports
 * @example
 * ```typescript
 * const result = mockRuleExecutionWithReports(3);
 * // result.reports will contain 3 mock RuleReport objects
 * ```
 */
const mockRuleExecutionWithReports = (reportCount = DEFAULT_REPORT_COUNT) => {
	const reports = Array.from({ length: reportCount }, () =>
		createMockTestReport(),
	);
	const actor = createMockActor();
	(actor.listComments as ReturnType<typeof vi.fn>).mockResolvedValue([]);

	const mockResult = {
		actor,
		entity: createMockEntity(),
		reports,
	};
	mockRunOctoGuideRules.mockResolvedValueOnce(mockResult);
	return mockResult;
};

/**
 * Factory for creating realistic RuleReport test objects.
 * Generates reports with all required properties and sensible defaults.
 * @param overrides Partial overrides to customize specific report properties
 * @returns Complete RuleReport mock with realistic structure
 * @example
 * ```typescript
 * const report = createMockTestReport({
 *   about: { name: "custom-rule" },
 *   data: { primary: "Custom violation message" }
 * });
 * ```
 */
const createMockTestReport = (
	overrides: Partial<RuleReport> = {},
): RuleReport => ({
	about: {
		description: "Test rule description",
		explanation: ["Test explanation"],
		name: "test-rule",
		url: "https://example.com",
	},
	data: {
		primary: "Test primary data",
		secondary: [],
		suggestion: ["fix this issue"],
	},
	...overrides,
});

// Store original environment state for cleanup
const originalEnv = { ...process.env };

beforeEach(() => {
	vi.clearAllMocks();
	// Reset to original state
	process.env = { ...originalEnv };
});

describe("runOctoGuideAction", () => {
	it("should log success message when no violations are detected", async () => {
		createMockActionInputs();
		createMinimalRuleExecution();

		await runOctoGuideAction(createMockContext(createMockPayload()));

		expect(mockCore.info).toHaveBeenCalledWith("Found 0 reports. Great! ✅");
	});

	it("should log report count and CLI output when violations are found", async () => {
		const consoleSpy = vi
			.spyOn(console, "log")
			.mockImplementation(() => undefined);
		createMockActionInputs();
		mockRuleExecutionWithReports(2);
		mockCliReporter.mockReturnValue("Mocked CLI report");

		await runOctoGuideAction(createMockContext(createMockPayload()));

		expect(mockCore.info).toHaveBeenCalledWith("Found 2 report(s).");
		expect(consoleSpy).toHaveBeenCalledWith("Mocked CLI report");
	});

	it("should call outputActionReports with correct parameters when reports are found", async () => {
		vi.spyOn(console, "log").mockImplementation(() => undefined);
		createMockActionInputs();
		const { reports } = mockRuleExecutionWithReports(2);
		mockCliReporter.mockReturnValue("Mocked CLI report");

		await runOctoGuideAction(createMockContext(createMockPayload()));

		expect(mockOutputActionReports).toHaveBeenCalledWith(
			expect.objectContaining({ metadata: { number: 1, type: "issue" } }),
			expect.objectContaining({
				data: { html_url: "https://github.com/test/repo/issues/1" },
			}),
			reports,
			expect.objectContaining({
				comments: {
					footer:
						"🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices.",
					header: "",
				},
			}),
		);
	});

	it("should call outputActionReports even when no reports are found", async () => {
		createMockActionInputs();
		createMinimalRuleExecution();

		await runOctoGuideAction(createMockContext(createMockPayload()));

		expect(mockOutputActionReports).toHaveBeenCalledWith(
			expect.objectContaining({ metadata: { number: 1, type: "issue" } }),
			expect.objectContaining({
				data: { html_url: "https://github.com/test/repo/issues/1" },
			}),
			[],
			expect.objectContaining({
				comments: {
					footer:
						"🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices.",
					header: "",
				},
			}),
		);
	});

	it("should exit gracefully when payload action is unknown", async () => {
		createMockActionInputs();

		await runOctoGuideAction(
			createMockContext(createMockPayload({ action: undefined })),
		);

		expect(mockCore.info).toHaveBeenCalledWith(
			"Unknown payload action. Exiting.",
		);
	});

	it("should throw error when entity cannot be determined from payload", async () => {
		createMockActionInputs();

		await expect(
			runOctoGuideAction(createMockContext({ action: "opened" })),
		).rejects.toThrow("Could not determine an entity to run OctoGuide on.");
	});

	it("should throw authentication error when GitHub token is missing", async () => {
		createMockActionInputs({ "github-token": "" });
		// Mock process.env.GITHUB_TOKEN to be undefined
		delete process.env.GITHUB_TOKEN;

		await expect(
			runOctoGuideAction(createMockContext(createMockPayload())),
		).rejects.toThrow("Please provide a with.github-token to octoguide.");
	});

	it("should run comment cleanup when entity is deleted", async () => {
		createMockActionInputs();
		const payload = createMockPayload({ action: "deleted" });

		await runOctoGuideAction(createMockContext(payload));

		expect(mockRunCommentCleanup).toHaveBeenCalledWith({
			auth: "mock-token",
			payload,
			url: "https://github.com/test/repo/issues/1",
		});
	});

	it("should throw error when unknown config is provided", async () => {
		createMockActionInputs({ config: "unknown-config" });

		await expect(
			runOctoGuideAction(createMockContext(createMockPayload())),
		).rejects.toThrow("Unknown config provided: unknown-config");
	});

	it("should use explicit config when specified in action inputs", async () => {
		createMockActionInputs({ config: "strict" });
		createMinimalRuleExecution();

		await runOctoGuideAction(createMockContext(createMockPayload()));

		expect(mockRunOctoGuideRules).toHaveBeenCalledWith({
			auth: "mock-token",
			entity: {
				data: { html_url: "https://github.com/test/repo/issues/1", number: 1 },
				number: 1,
				type: "issue",
			},
			settings: {
				comments: {
					footer:
						"🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices.",
					header: "",
				},
				config: "strict",
				rules: {},
			},
		});
	});

	it("should pass none as config when specified in action inputs", async () => {
		createMockActionInputs({ config: "none" });
		createMinimalRuleExecution();

		await runOctoGuideAction(createMockContext(createMockPayload()));

		expect(mockRunOctoGuideRules).toHaveBeenCalledWith({
			auth: "mock-token",
			entity: {
				data: { html_url: "https://github.com/test/repo/issues/1", number: 1 },
				number: 1,
				type: "issue",
			},
			settings: {
				comments: {
					footer:
						"🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices.",
					header: "",
				},
				config: "none",
				rules: {},
			},
		});
	});

	it("should fall back to recommended config when input is empty", async () => {
		createMockActionInputs({ config: "" }); // Empty string should fall back to "recommended"
		createMinimalRuleExecution();

		await runOctoGuideAction(createMockContext(createMockPayload()));

		expect(mockRunOctoGuideRules).toHaveBeenCalledWith({
			auth: "mock-token",
			entity: {
				data: { html_url: "https://github.com/test/repo/issues/1", number: 1 },
				number: 1,
				type: "issue",
			},
			settings: {
				comments: {
					footer:
						"🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices.",
					header: "",
				},
				config: "recommended",
				rules: {},
			},
		});
	});

	it("should use the default footer comment when no footer is specified in config", async () => {
		createMockActionInputs({});
		createMinimalRuleExecution();
		await runOctoGuideAction(createMockContext(createMockPayload()));

		expect(mockOutputActionReports).toHaveBeenCalledWith(
			expect.objectContaining({ metadata: { number: 1, type: "issue" } }),
			expect.objectContaining({
				data: { html_url: "https://github.com/test/repo/issues/1" },
			}),
			expect.anything(),
			expect.objectContaining({
				comments: {
					footer:
						"🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices.",
					header: "",
				},
			}),
		);
	});

	it("should use the custom footer comment when specified in config", async () => {
		createMockActionInputs({
			"comment-footer": "Custom footer message!",
		});
		createMinimalRuleExecution();
		await runOctoGuideAction(createMockContext(createMockPayload()));
		expect(mockOutputActionReports).toHaveBeenCalledWith(
			expect.objectContaining({ metadata: { number: 1, type: "issue" } }),
			expect.objectContaining({
				data: { html_url: "https://github.com/test/repo/issues/1" },
			}),
			expect.anything(),
			expect.objectContaining({
				comments: {
					footer: "Custom footer message!",
					header: "",
				},
			}),
		);
	});

	it("should not include rules in settings when no rules are enabled", async () => {
		createMockActionInputs({});
		createMinimalRuleExecution();

		await runOctoGuideAction(createMockContext(createMockPayload()));

		expect(mockOutputActionReports).toHaveBeenCalledWith(
			expect.objectContaining({ metadata: { number: 1, type: "issue" } }),
			expect.objectContaining({
				data: { html_url: "https://github.com/test/repo/issues/1" },
			}),
			expect.anything(),
			expect.objectContaining({
				comments: {
					footer:
						"🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices.",
					header: "",
				},
				config: "recommended",
				rules: {},
			}),
		);
	});

	it("should include enabled rules in settings when specified in inputs", async () => {
		createMockActionInputs({
			"rule-pr-body-descriptive": "true",
			"rule-pr-title-conventional": "false",
		});
		createMinimalRuleExecution();

		await runOctoGuideAction(createMockContext(createMockPayload()));

		expect(mockOutputActionReports).toHaveBeenCalledWith(
			expect.objectContaining({ metadata: { number: 1, type: "issue" } }),
			expect.objectContaining({
				data: { html_url: "https://github.com/test/repo/issues/1" },
			}),
			expect.anything(),
			expect.objectContaining({
				comments: {
					footer:
						"🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices.",
					header: "",
				},
				config: "recommended",
				rules: {
					"pr-body-descriptive": true,
					"pr-title-conventional": false,
				},
			}),
		);
	});

	describe("entity payload validation", () => {
		it("should throw error when entity payload is missing number property", async () => {
			createMockActionInputs();

			await expect(
				runOctoGuideAction(
					createMockContext(
						createMockPayload({
							issue: {
								html_url: "https://github.com/test/repo/issues/1",
							} as unknown as typeof github.context.payload.issue,
						}),
					),
				),
			).rejects.toThrow("Entity payload missing valid number property");
		});

		it("should throw error when entity payload has invalid number property", async () => {
			createMockActionInputs();

			await expect(
				runOctoGuideAction(
					createMockContext(
						createMockPayload({
							issue: {
								html_url: "https://github.com/test/repo/issues/1",
								number: "invalid" as unknown as number,
							},
						}),
					),
				),
			).rejects.toThrow("Entity payload missing valid number property");
		});

		it("should throw error when entity payload has negative number", async () => {
			createMockActionInputs();

			await expect(
				runOctoGuideAction(
					createMockContext(
						createMockPayload({
							issue: {
								html_url: "https://github.com/test/repo/issues/1",
								number: -1,
							},
						}),
					),
				),
			).rejects.toThrow("Entity payload missing valid number property");
		});

		it("should throw error when entity payload is missing html_url", async () => {
			createMockActionInputs();

			await expect(
				runOctoGuideAction(
					createMockContext(
						createMockPayload({
							issue: {
								number: 1,
							} as unknown as typeof github.context.payload.issue,
						}),
					),
				),
			).rejects.toThrow("Target entity's html_url is not a string.");
		});

		it("should not throw error when entity payload has null body and user properties", async () => {
			createMockActionInputs();
			createMinimalRuleExecution();

			// Should not throw with null values for optional properties
			await expect(
				runOctoGuideAction(
					createMockContext(
						createMockPayload({
							issue: {
								body: null as unknown as string,
								html_url: "https://github.com/test/repo/issues/1",
								number: 1,
								user: null as unknown as object,
							},
						}),
					),
				),
			).resolves.not.toThrow();
		});
	});

	describe("entity type detection from URL", () => {
		it("should detect issue entity type when URL contains /issues/", async () => {
			createMockActionInputs();
			const actor = createMockActor();
			(actor.listComments as ReturnType<typeof vi.fn>).mockResolvedValue([]);

			const mockResult = {
				actor,
				entity: {
					data: {
						html_url: "https://github.com/owner/repo/issues/123",
						number: 123,
					} as Entity["data"],
					number: 123,
					type: "issue" as const,
				},
				reports: [],
			};
			mockRunOctoGuideRules.mockResolvedValueOnce(mockResult);

			await runOctoGuideAction(
				createMockContext(
					createMockPayload({
						issue: {
							html_url: "https://github.com/owner/repo/issues/123",
							number: 123,
						},
					}),
				),
			);

			expect(mockRunOctoGuideRules).toHaveBeenCalledWith(
				expect.objectContaining({
					entity: expect.objectContaining({
						number: 123,
						type: "issue",
					}),
				}),
			);
		});

		it("should detect pull request entity type when URL contains /pull/", async () => {
			createMockActionInputs();
			const actor = createMockActor();
			(actor.listComments as ReturnType<typeof vi.fn>).mockResolvedValue([]);

			const mockResult = {
				actor,
				entity: {
					data: {
						html_url: "https://github.com/owner/repo/pull/456",
						number: 456,
					} as Entity["data"],
					number: 456,
					type: "pull_request" as const,
				},
				reports: [],
			};
			mockRunOctoGuideRules.mockResolvedValueOnce(mockResult);

			await runOctoGuideAction(
				createMockContext(
					createMockPayload({
						issue: undefined,
						pull_request: {
							html_url: "https://github.com/owner/repo/pull/456",
							number: 456,
						},
					}),
				),
			);

			expect(mockRunOctoGuideRules).toHaveBeenCalledWith(
				expect.objectContaining({
					entity: expect.objectContaining({
						number: 456,
						type: "pull_request",
					}),
				}),
			);
		});

		it("should detect discussion entity type when URL contains /discussions/", async () => {
			createMockActionInputs();
			const actor = createMockActor();
			(actor.listComments as ReturnType<typeof vi.fn>).mockResolvedValue([]);

			const mockResult = {
				actor,
				entity: {
					data: {
						html_url: "https://github.com/owner/repo/discussions/789",
						number: 789,
					} as Entity["data"],
					number: 789,
					type: "discussion" as const,
				},
				reports: [],
			};
			mockRunOctoGuideRules.mockResolvedValueOnce(mockResult);

			await runOctoGuideAction(
				createMockContext(
					createMockPayload({
						discussion: {
							html_url: "https://github.com/owner/repo/discussions/789",
							number: 789,
						},
						issue: undefined,
					}),
				),
			);

			expect(mockRunOctoGuideRules).toHaveBeenCalledWith(
				expect.objectContaining({
					entity: expect.objectContaining({
						number: 789,
						type: "discussion",
					}),
				}),
			);
		});

		it("should throw error when URL contains invalid path patterns", async () => {
			createMockActionInputs();

			await expect(
				runOctoGuideAction(
					createMockContext(
						createMockPayload({
							issue: {
								html_url: "https://github.com/owner/repo/invalid/123",
								number: 123,
							},
						}),
					),
				),
			).rejects.toThrow(
				"Could not determine entity type from URL: https://github.com/owner/repo/invalid/123",
			);
		});

		it("should throw error when URL is missing numeric ID", async () => {
			createMockActionInputs();

			await expect(
				runOctoGuideAction(
					createMockContext(
						createMockPayload({
							issue: {
								html_url: "https://github.com/owner/repo/issues/",
								number: 123,
							},
						}),
					),
				),
			).rejects.toThrow(
				"Could not determine entity type from URL: https://github.com/owner/repo/issues/",
			);
		});

		it("should throw error when URL is not a GitHub URL", async () => {
			createMockActionInputs();

			await expect(
				runOctoGuideAction(
					createMockContext(
						createMockPayload({
							issue: {
								html_url: "https://example.com/not-a-github-url",
								number: 123,
							},
						}),
					),
				),
			).rejects.toThrow(
				"Could not determine entity type from URL: https://example.com/not-a-github-url",
			);
		});

		it("should detect entity type when URL contains additional path segments", async () => {
			createMockActionInputs();
			createMinimalRuleExecution();

			await runOctoGuideAction(
				createMockContext(
					createMockPayload({
						issue: {
							html_url: "https://github.com/owner/repo/issues/123#comment-456",
							number: 123,
						},
					}),
				),
			);

			expect(mockRunOctoGuideRules).toHaveBeenCalledWith(
				expect.objectContaining({
					entity: expect.objectContaining({
						number: 123,
						type: "issue",
					}),
				}),
			);
		});

		it("should detect entity type when URL contains query parameters", async () => {
			createMockActionInputs();
			const actor = createMockActor();
			(actor.listComments as ReturnType<typeof vi.fn>).mockResolvedValue([]);

			const mockResult = {
				actor,
				entity: {
					data: {
						html_url: "https://github.com/owner/repo/pull/789?tab=files",
						number: 789,
					} as Entity["data"],
					number: 789,
					type: "pull_request" as const,
				},
				reports: [],
			};
			mockRunOctoGuideRules.mockResolvedValueOnce(mockResult);

			await runOctoGuideAction(
				createMockContext(
					createMockPayload({
						issue: undefined,
						pull_request: {
							html_url: "https://github.com/owner/repo/pull/789?tab=files",
							number: 789,
						},
					}),
				),
			);

			expect(mockRunOctoGuideRules).toHaveBeenCalledWith(
				expect.objectContaining({
					entity: expect.objectContaining({
						number: 789,
						type: "pull_request",
					}),
				}),
			);
		});
	});
});
