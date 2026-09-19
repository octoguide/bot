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
	/**
	 * Options the rule should run with unless overridden per-rule by users.
	 * These take precedence over any options users set globally for all rules.
	 */
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
	 * Options the rule is running with, resolved from rule and user settings.
	 */
	options: RuleOptions;

	/**
	 * Registers a new violation.
	 */
	report: RuleReporter;
}

/**
 * Options for a rule, as resolved for a run.
 */
export interface RuleOptions {
	[key: string]: unknown;

	/**
	 * Author associations of entities the rule runs on, or `undefined` for all.
	 */
	"include-associations"?: Set<string>;

	/**
	 * Whether the rule runs on entities created by bots.
	 */
	"include-bots": boolean;
}

/**
 * Options for a rule, as provided in rule and user settings.
 */
export interface RuleOptionsRaw {
	[key: string]: unknown;

	/**
	 * Author associations of entities the rule runs on.
	 * `"NONE"` is always included.
	 */
	"include-associations"?: string[];

	/**
	 * Whether the rule runs on entities created by bots.
	 */
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
