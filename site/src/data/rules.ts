import { allRules } from "../../../src/rules/all.ts";

export function getRule(name: string) {
	const rule = allRules.find((candidate) => candidate.about.name === name);

	if (!rule) {
		throw new Error(`Rule ${name} not found`);
	}

	return rule;
}
