import type { Rule, RuleAbout, RuleAboutWithUrl } from "./types/rules";

export type RuleUrlCreator<Metadata> = (about: Metadata & RuleAbout) => string;

/**
 * Creates a function that defines a rule with a URL.
 * @param createUrl Generates a URL for the rule based on its metadata.
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
