import { CommitParser } from "conventional-commits-parser";

// Configuring the parser to recognize breaking-change headers that
// include a `!` before the colon (e.g., `fix!: ...` or `fix(scope)!: ...`).
// (see https://github.com/conventional-changelog/conventional-changelog/issues/648)
// Both patterns accept any scope without parentheses, so titles parse the same
// with or without a `!` and multiple scopes can be reported on directly.
export const commitParser = new CommitParser({
	// Matches: type, optional (scope), '!' and the subject
	breakingHeaderPattern: /^(\w*)(?:\(([^()]*)\))?!: (.*)$/,
	// Matches: type, optional (scope), and the subject
	headerPattern: /^(\w*)(?:\(([^()]*)\))?: (.*)$/,
});
