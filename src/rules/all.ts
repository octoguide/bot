import { commentMeaningful } from "./commentMeaningful.ts";
import { prAutomationDetected } from "./prAutomationDetected.ts";
import { prBodyDescriptive } from "./prBodyDescriptive.ts";
import { prBranchNonDefault } from "./prBranchNonDefault.ts";
import { prLinkedIssue } from "./prLinkedIssue.ts";
import { prTaskCompletion } from "./prTaskCompletion.ts";
import { prTitleConventional } from "./prTitleConventional.ts";
import { textImageAltText } from "./textImageAltText.ts";
import { titleMeaningful } from "./titleMeaningful.ts";

export const allRules = [
	commentMeaningful,
	prAutomationDetected,
	prBranchNonDefault,
	prBodyDescriptive,
	prLinkedIssue,
	prTaskCompletion,
	prTitleConventional,
	textImageAltText,
	titleMeaningful,
];
