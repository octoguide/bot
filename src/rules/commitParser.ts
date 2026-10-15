import { CommitParser } from "conventional-commits-parser";

// Configuring the parser to recognize breaking-change headers that
// include a `!` before the colon (e.g., `fix!: ...` or `fix(scope)!: ...`).
// (see https://github.com/conventional-changelog/conventional-changelog/issues/648)
// This helps the parser populate `parsed.type` correctly in more cases.
export const commitParser = new CommitParser({
	// Matches: type, optional (scope), '!' and the subject
	breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
});
