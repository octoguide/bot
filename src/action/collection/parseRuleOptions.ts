import { RuleOptionsRaw } from "../../types/rules";

export function parseRuleOptions(input: string) {
	if (input === "") {
		return {};
	}

	try {
		return JSON.parse(input) as RuleOptionsRaw;
	} catch (error) {
		return error as Error;
	}
}
