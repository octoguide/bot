import { commentMeaningful } from "./commentMeaningful.js";
import { prAiGenerated } from "./prAiGenerated.js";
import { prBodyDescriptive } from "./prBodyDescriptive.js";
import { prBranchNonDefault } from "./prBranchNonDefault.js";
import { prLinkedIssue } from "./prLinkedIssue.js";
import { prTaskCompletion } from "./prTaskCompletion.js";
import { prTitleConventional } from "./prTitleConventional.js";
import { textImageAltText } from "./textImageAltText.js";

export const allRules = [
	commentMeaningful,
	prAiGenerated,
	prBranchNonDefault,
	prBodyDescriptive,
	prLinkedIssue,
	prTaskCompletion,
	prTitleConventional,
	textImageAltText,
];
