import { regex } from "arkregex";
import conventionalTypes from "conventional-commit-types" with { type: "json" };

import { commitParser } from "./commitParser.ts";

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
	const titlePattern = regex("^(\\w+)\\b(\\s*\\([^)]*\\))?(!)?(.*)$");
	const leadingExclamationMarksPattern = regex("^!+");
	const leadingColonPattern = regex("^\\s*:");
	const leadingBracketedTextPattern = regex("^\\s*(\\[[^\\]]*\\]):(?=\\s|$)");
	const colonBeforeNonWhitespacePattern = regex("\\s*:\\s*(?=\\S)", "g");
	const trailingColonPattern = regex("\\s*:\\s*$");
	const match = titlePattern.exec(title);
	if (!match) {
		return undefined;
	}

	const [, rawType, rawScope = "", breaking = "", rawRest] = match;
	const type = rawType.toLowerCase();
	const scope = rawScope.trimStart();
	const rest = breaking
		? rawRest.replace(leadingExclamationMarksPattern, "")
		: rawRest;

	if (
		!Object.hasOwn(conventionalTypes.types, type) ||
		rest.trimStart().startsWith("!")
	) {
		return undefined;
	}

	let subject: string;

	if (leadingColonPattern.test(rest)) {
		subject = rest.replace(leadingColonPattern, "");
	} else if (breaking || scope) {
		subject = rest.replace(leadingBracketedTextPattern, "$1");
	} else {
		return undefined;
	}

	const header = type + scope + breaking;
	subject = subject
		.replace(colonBeforeNonWhitespacePattern, " - ")
		.replace(trailingColonPattern, "")
		.trim();

	return isConventionalTitle(`${header}: ${subject || "etc."}`)
		? { header, subject }
		: undefined;
}
