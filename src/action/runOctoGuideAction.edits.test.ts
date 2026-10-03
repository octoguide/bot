import type * as github from "@actions/github";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CommentData, Entity } from "../types/entities.js";
import type {
	Rule,
	RuleAboutWithUrl,
	RuleContext,
	RuleOptionsRaw,
} from "../types/rules.js";

import { RESOLVED_BY_OCTOGUIDE } from "../constants.js";
import { createCommentIdentifier } from "./comments/createCommentIdentifier.js";
import { runOctoGuideAction } from "./runOctoGuideAction.js";

const ISSUE_URL = "https://github.com/owner/repo/issues/1";

const mockCore = {
	debug: vi.fn(),
	getInput: vi.fn(),
	info: vi.fn(),
	isDebug: vi.fn(),
	setFailed: vi.fn(),
	summary: {
		addHeading: vi.fn(),
		addRaw: vi.fn(),
		addSeparator: vi.fn(),
		write: vi.fn(),
	},
	warning: vi.fn(),
};

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
	get isDebug() {
		return mockCore.isDebug;
	},
	get setFailed() {
		return mockCore.setFailed;
	},
	get summary() {
		return mockCore.summary;
	},
	get warning() {
		return mockCore.warning;
	},
}));

const mockCreateActor = vi.fn();

vi.mock("../actors/createActor.js", () => ({
	get createActor() {
		return mockCreateActor;
	},
}));

function createFakeRule(
	name: string,
	isViolation: (body: string) => boolean,
	defaultOptions?: RuleOptionsRaw,
): Rule<RuleAboutWithUrl> {
	const listener = (context: RuleContext, entity: Entity) => {
		if (isViolation(entity.data.body ?? "")) {
			context.report({
				primary: `Found a ${name} violation.`,
				suggestion: [`Fix the ${name} violation.`],
			});
		}
	};

	return {
		about: {
			defaultOptions,
			description: `Checks ${name}.`,
			explanation: [`Checks ${name}.`],
			name,
			url: `https://octo.guide/rules/${name}`,
		},
		comment: listener,
		issue: listener,
		pullRequest: listener,
	};
}

const fakeRules = [
	createFakeRule("linked-issue", (body) => !body.includes("fixes #")),
	createFakeRule("alt-text", (body) => body.includes("![]("), {
		"include-associations": [
			"COLLABORATOR",
			"CONTRIBUTOR",
			"FIRST_TIME_CONTRIBUTOR",
			"FIRST_TIMER",
			"MEMBER",
			"OWNER",
		],
	}),
	createFakeRule("automation", (body) => body.includes("automated"), {
		"include-bots": true,
	}),
];

vi.mock("../rules/all.js", () => ({
	get allRules() {
		return fakeRules;
	},
}));

vi.mock("../rules/configs.js", () => ({
	get configs() {
		return { none: [], recommended: fakeRules, strict: fakeRules };
	},
	isKnownConfig: () => true,
}));

function createContext(
	body: string,
	sender: { login: string; type: string },
	overrides: Partial<typeof github.context.payload> = {},
) {
	const payload: typeof github.context.payload = {
		action: "edited",
		changes: { body: { from: "Old body." } },
		issue: {
			author_association: "CONTRIBUTOR",
			body,
			html_url: ISSUE_URL,
			number: 1,
			user: { login: "author", type: "User" },
		},
		sender,
		...overrides,
	};

	return {
		eventName: "issues",
		payload,
		repo: { owner: "owner", repo: "repo" },
	} satisfies Partial<typeof github.context> as typeof github.context;
}

function createMockActor(comments: Partial<CommentData>[] = []) {
	return {
		closeEntity: vi.fn(),
		createComment: vi.fn().mockResolvedValue(`${ISSUE_URL}#issuecomment-99`),
		getData: vi.fn(),
		listComments: vi.fn().mockResolvedValue(comments),
		metadata: { number: 1, type: "issue" },
		minimizeComment: vi.fn().mockResolvedValue(true),
		unminimizeComment: vi.fn().mockResolvedValue(true),
		updateComment: vi.fn(),
	};
}

function setUp({
	comments,
	inputs,
}: {
	comments?: Partial<CommentData>[];
	inputs?: Record<string, string>;
} = {}) {
	const allInputs: Record<string, string> = {
		"github-token": "mock-token",
		"include-associations": "FIRST_TIMER,FIRST_TIME_CONTRIBUTOR,CONTRIBUTOR",
		...inputs,
	};
	mockCore.getInput.mockImplementation((name: string) => allInputs[name] ?? "");

	const actor = createMockActor(comments);
	mockCreateActor.mockResolvedValue({
		actor,
		locator: { owner: "owner", repository: "repo" },
		octokit: {},
	});

	return actor;
}

const bot = { login: "renovate[bot]", type: "Bot" };
const collaborator = { login: "collaborator", type: "User" };
const owner = { login: "owner", type: "User" };

const existingComment = {
	body: `👋 Hi @author, thanks for the issue! ...\n\n${createCommentIdentifier(ISSUE_URL)}`,
	html_url: `${ISSUE_URL}#issuecomment-50`,
	id: 50,
	node_id: "IC_50",
};

describe("runOctoGuideAction on edits by other users", () => {
	beforeEach(() => {
		vi.stubGlobal("console", { ...console, log: vi.fn() });
	});

	it("resolves an existing comment when an excluded editor's edit leaves no reports", async () => {
		const actor = setUp({ comments: [existingComment] });

		await runOctoGuideAction(createContext("This fixes #2.", collaborator));

		expect(actor.updateComment).toHaveBeenCalledWith(
			existingComment.id,
			expect.stringContaining(RESOLVED_BY_OCTOGUIDE),
		);
		expect(actor.minimizeComment).toHaveBeenCalledWith(existingComment.node_id);
		expect(actor.createComment).not.toHaveBeenCalled();
		expect(mockCore.setFailed).not.toHaveBeenCalled();
	});

	it("leaves an existing comment as-is when an excluded editor's edit leaves reports from rules that exclude them", async () => {
		const actor = setUp({ comments: [existingComment] });

		await runOctoGuideAction(createContext("Fixed a typo.", collaborator));

		expect(mockCore.info).toHaveBeenCalledWith(
			"Found 1 report(s), all from rules that exclude the editor. Leaving any existing comment as-is.",
		);
		expect(actor.updateComment).not.toHaveBeenCalled();
		expect(actor.minimizeComment).not.toHaveBeenCalled();
		expect(actor.createComment).not.toHaveBeenCalled();
		expect(mockCore.setFailed).not.toHaveBeenCalled();
	});

	it("does not create a comment when an excluded editor's edit leaves reports from rules that exclude them", async () => {
		const actor = setUp();

		await runOctoGuideAction(createContext("Fixed a typo.", collaborator));

		expect(actor.createComment).not.toHaveBeenCalled();
		expect(mockCore.setFailed).not.toHaveBeenCalled();
	});

	it("mentions an editor included by a per-rule override", async () => {
		const actor = setUp({
			inputs: {
				rules: JSON.stringify({
					"linked-issue": { "include-associations": ["COLLABORATOR"] },
				}),
			},
		});

		await runOctoGuideAction(createContext("Fixed a typo.", collaborator));

		expect(actor.createComment).toHaveBeenCalledWith(
			expect.stringMatching(/^👋 Hi @collaborator, [\s\S]*linked-issue/),
		);
		expect(mockCore.setFailed).toHaveBeenCalled();
	});

	it("only reports rules whose default options include the editor", async () => {
		const actor = setUp({ comments: [existingComment] });

		await runOctoGuideAction(
			createContext("Added a screenshot: ![](image.png)", collaborator),
		);

		const body = (actor.updateComment.mock.calls[0] as [number, string])[1];
		expect(body).toMatch(/^👋 Hi @collaborator, [\s\S]*alt-text/);
		expect(body).not.toContain("linked-issue");
		expect(actor.createComment).not.toHaveBeenCalled();
	});

	it("treats the repository owner as an OWNER editor", async () => {
		const actor = setUp({
			inputs: {
				rules: JSON.stringify({
					"linked-issue": { "include-associations": ["OWNER"] },
				}),
			},
		});

		await runOctoGuideAction(createContext("Fixed a typo.", collaborator));

		expect(actor.createComment).not.toHaveBeenCalled();

		await runOctoGuideAction(createContext("Fixed a typo.", owner));

		expect(actor.createComment).toHaveBeenCalledWith(
			expect.stringMatching(/^👋 Hi @owner, [\s\S]*linked-issue/),
		);
	});

	it("only reports rules that include bots when a bot is the editor", async () => {
		const actor = setUp();

		await runOctoGuideAction(
			createContext("Some automated changes. ![](image.png)", bot),
		);

		const body = (actor.createComment.mock.calls[0] as [string])[0];
		expect(body).toMatch(/^👋 Hi @renovate\[bot\], [\s\S]*automation/);
		expect(body).not.toContain("alt-text");
		expect(body).not.toContain("linked-issue");
	});

	it.each([bot, collaborator, owner])(
		"does not report on an excluded bot's pull request when $login edits it",
		async (sender) => {
			const actor = setUp();
			const payload: typeof github.context.payload = {
				action: "edited",
				changes: { body: { from: "- [ ] Rebase this PR." } },
				pull_request: {
					author_association: "CONTRIBUTOR",
					body: "Updates a dependency. ![](badge.svg)\n\n- [x] Rebase this PR.",
					html_url: "https://github.com/owner/repo/pull/2",
					number: 2,
					user: bot,
				},
				sender,
			};

			await runOctoGuideAction({
				eventName: "pull_request",
				payload,
				repo: { owner: "owner", repo: "repo" },
			} satisfies Partial<typeof github.context> as typeof github.context);

			expect(actor.createComment).not.toHaveBeenCalled();
			expect(actor.updateComment).not.toHaveBeenCalled();
			expect(mockCore.setFailed).not.toHaveBeenCalled();
		},
	);

	it("mentions the editor of another user's comment", async () => {
		const actor = setUp();
		const commentUrl = `${ISSUE_URL}#issuecomment-2`;

		await runOctoGuideAction(
			createContext("Fixed a typo.", collaborator, {
				comment: {
					author_association: "CONTRIBUTOR",
					body: "Here's a screenshot: ![](image.png)",
					html_url: commentUrl,
					id: 2,
					user: { login: "commenter", type: "User" },
				},
			}),
		);

		const body = (actor.createComment.mock.calls[0] as [string])[0];
		expect(body).toMatch(
			/^👋 Hi @collaborator, thanks for the \[comment\][\s\S]*alt-text/,
		);
		expect(body).not.toContain("linked-issue");
		expect(body).toContain(createCommentIdentifier(commentUrl));
	});
});
