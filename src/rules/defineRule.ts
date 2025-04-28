import type { Rule, RuleAbout } from "../types/rules";

export function defineRule<About extends RuleAbout>(rule: Rule<About>) {
	return rule;
}
