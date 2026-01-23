import type { Rule, RuleAbout, RuleAboutWithUrl } from "./types/rules";

/**
 * Function that generates a URL for a rule based on its metadata.
 * @internal
 */
export type RuleUrlCreator<Metadata> = (about: Metadata & RuleAbout) => string;

/**
 * Creates a function that defines a rule with a URL.
 * @param createUrl Function that generates a URL for a rule based on its metadata
 * @returns A function that takes a rule and returns it with a URL added
 * @internal
 */
export function createDefineRule<Metadata>(
	createUrl: RuleUrlCreator<Metadata>,
) {
	return function defineRule(
		rule: Rule<Metadata & RuleAbout>,
	): Rule<Metadata & RuleAboutWithUrl> {
		return {
			...rule,
			about: {
				url: createUrl(rule.about),
				...rule.about,
			},
		};
	};
}
