import type { Rule, RuleOptions } from "./rules.js";

export interface Comments {
	footer: string;
	header: string;
}

export interface RuleAndOptions {
	options: RuleOptions;
	rule: Rule;
}

export interface Settings {
	comments?: Comments;
	rules: RuleAndOptions[];
}
