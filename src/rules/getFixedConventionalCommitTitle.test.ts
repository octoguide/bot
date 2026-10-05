import { describe, expect, it } from "vitest";

import { getFixedConventionalCommitTitle } from "./getFixedConventionalCommitTitle.js";

describe(getFixedConventionalCommitTitle, () => {
	it.each([
		[
			"fix(md) [headingIncrements]: fill in suggestions TODO md",
			{
				header: "fix(md)",
				subject: "[headingIncrements] fill in suggestions TODO md",
			},
		],
		[
			"fix(md) fill in suggestions",
			{ header: "fix(md)", subject: "fill in suggestions" },
		],
		[
			"fix:fill in suggestions",
			{ header: "fix", subject: "fill in suggestions" },
		],
		[
			"fix : fill in suggestions",
			{ header: "fix", subject: "fill in suggestions" },
		],
		[
			"feat(api)! drop old option",
			{ header: "feat(api)!", subject: "drop old option" },
		],
		["feat(scope)!x", { header: "feat(scope)!", subject: "x" }],
		[
			"fix(api) handle error: timeout",
			{ header: "fix(api)", subject: "handle error: timeout" },
		],
		[
			"docs(readme) Note: something",
			{ header: "docs(readme)", subject: "Note: something" },
		],
		["Feat:add x", { header: "feat", subject: "add x" }],
		["FIX(md) x", { header: "fix(md)", subject: "x" }],
		["feat (scope): x", { header: "feat(scope)", subject: "x" }],
		["chore (deps): bump x", { header: "chore(deps)", subject: "bump x" }],
		["feat (scope)! x", { header: "feat(scope)!", subject: "x" }],
		["fix(md)", { header: "fix(md)", subject: "" }],
	])("returns a fixed title for %j", (title, expected) => {
		expect(getFixedConventionalCommitTitle(title)).toEqual(expected);
	});

	it.each([
		"[docs] update readme",
		"other(md) x",
		"fix something",
		"feat(a(b)) x",
		"fix(a)!!: x",
		"fix (windows) path handling",
	])("returns undefined for %j", (title) => {
		expect(getFixedConventionalCommitTitle(title)).toBeUndefined();
	});
});
