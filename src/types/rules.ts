import type { Octokit } from "octokit";

import type { RepositoryLocator } from "./data.js";
import type {
	CommentEntity,
	DiscussionEntity,
	Entity,
	IssueEntity,
	PullRequestEntity,
} from "./entities.js";
import type { RuleReportData } from "./reports.js";

/**
 * Defines how to analyze entities for a single best practice.
 */
export interface Rule<About extends RuleAbout = RuleAbout> {
	/**
	 * Metadata about the rule.
	 */
	about: About;

	/**
	 * Callback to run if the entity is a comment.
	 */
	comment?: RuleListener<CommentEntity>;

	/**
	 * Callback to run if the entity is a discussion.
	 */
	discussion?: RuleListener<DiscussionEntity>;

	/**
	 * Callback to run if the entity is a issue.
	 */
	issue?: RuleListener<IssueEntity>;

	/**
	 * Callback to run if the entity is a pull request.
	 */
	pullRequest?: RuleListener<PullRequestEntity>;
}

/**
 * Metadata about a rule, as used to define the rule.
 */
export interface RuleAbout {
	// TODO: make a type? describe?
	defaultOptions?: RuleOptionsRaw;

	/**
	 * Single sentence description of the rule.
	 */
	description: string;

	/**
	 * Additional sentences describing the rule.
	 */
	explanation: string[];

	/**
	 * kebab-case name of the rule.
	 */
	name: string;
}

/**
 * Metadata about a rule, as available for a defined rule.
 */
export interface RuleAboutWithUrl extends RuleAbout {
	/**
	 * URL to the rule's documentation.
	 */
	url: string;
}

/**
 * Shared context provided to rules when they run on an entity.
 */
export interface RuleContext {
	/**
	 * Repository location on GitHub.
	 */
	locator: RepositoryLocator;

	/**
	 * Octokit instance that can send GitHub API calls.
	 */
	octokit: Octokit;

	/**
	 * Registers a new violation.
	 */
	report: RuleReporter;

	/**
	 * Processed options for any rule that may be provided by the user.
	 */
	options?: RuleOptions;
}

/**
 * Options for any rule that as provided by the user.
 */
export interface RuleOptionsRaw {
	[i: string]: unknown;
	"include-associations"?: string[];
	"include-bots"?: boolean;
}

/**
 * Processed options for any rule that may be provided by the user.
 */
export interface RuleOptions {
	[i: string]: unknown;
	"include-associations"?: Set<string>;
	"include-bots"?: boolean;
}

/**
 * Rule property called if the rule is run on the corresponding entity type.
 * @template Target Type of entity this function may be called on.
 */
export type RuleListener<Target extends Entity> = (
	context: RuleContext,
	entity: Target,
) => Promise<void> | void;

/**
 * Context function for a rule to register a new violation.
 */
export type RuleReporter = (data: RuleReportData) => void;
