import { commentMeaningless } from "./commentMeaningless.js";
import { prBodyNotEmpty } from "./prBodyNotEmpty.js";
import { prBranchNonDefault } from "./prBranchNonDefault.js";
import { prLinkedIssue } from "./prLinkedIssue.js";
import { prTaskCompletion } from "./prTaskCompletion.js";
import { prTitleConventional } from "./prTitleConventional.js";
import { textImageAltText } from "./textImageAltText.js";

export const allRules = [
	commentMeaningless,
	prBranchNonDefault,
	prBodyNotEmpty,
	prLinkedIssue,
	prTaskCompletion,
	prTitleConventional,
	textImageAltText,
];
