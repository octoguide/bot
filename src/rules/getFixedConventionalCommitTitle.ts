import conventionalTypes from "conventional-commit-types" with { type: "json" };

import { commitParser } from "./commitParser.js";

/**
 * Whether a title would pass pr-title-conventional: it parses with a known type and subject.
 */
function isConventionalTitle(title: string) {
	const parsed = commitParser.parse(title);

	return (
		!!parsed.type &&
		Object.hasOwn(conventionalTypes.types, parsed.type) &&
		!!parsed.subject
	);
}

/**
 * Attempts to fix a title that starts with a known type, but doesn't follow it
 * with a colon and space, such as `fix(md) [headingIncrements]: subject`.
 */
export function getFixedConventionalCommitTitle(title: string) {
	const match = /^(\w+)\b(\s*\([^)]*\))?(!)?(.*)$/.exec(title);
	if (!match) {
		return undefined;
	}

	const [, rawType, rawScope = "", breaking = "", rest] = match;
	const type = rawType.toLowerCase();
	const scope = rawScope.trimStart();
	const leadingColon = /^\s*:/;

	if (
		!Object.hasOwn(conventionalTypes.types, type) ||
		rest.trimStart().startsWith("!")
	) {
		return undefined;
	}

	let subject: string;

	if (leadingColon.test(rest)) {
		subject = rest.replace(leadingColon, "");
	} else if (breaking || (scope && scope === rawScope)) {
		subject = rest.replace(/^\s*(\[[^\]]*\]):(?=\s|$)/, "$1");
	} else {
		return undefined;
	}

	const header = type + scope + breaking;
	subject = subject.trim();

	return isConventionalTitle(`${header}: ${subject || "etc."}`)
		? { header, subject }
		: undefined;
}
