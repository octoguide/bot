import type { Settings } from "../../types/settings.ts";

export function parseRules(input: string) {
	if (input === "") {
		return {};
	}

	try {
		return JSON.parse(input) as NonNullable<Settings["rules"]>;
	} catch (error) {
		return error as Error;
	}
}
