import { RuleOptions, RuleOptionsRaw } from "../types/rules";
import { parseIncludeAssociations } from "./parseIncludeAssociations";

export function parseRulesConfig(input: string) {
	if (input === "") {
		return {};
	}

	try {
		return processRulesConfig(JSON.parse(input) as RuleOptionsRaw);
	} catch (error) {
		return error as Error;
	}
}

function processRulesConfig(raw: RuleOptionsRaw): RuleOptions {
	return {
		...raw,
		// TODO: this is wrong
		// these shouldn't be at root
		// these are for each rule
		"include-associations": raw["include-associations"]
			? parseIncludeAssociations(raw["include-associations"])
			: undefined,
		"include-bots": !raw["include-bots"],
	};
}
