import { commentMeaningful } from "./commentMeaningful.js";
import { prAutomationDetected } from "./prAutomationDetected.js";
import { prBodyDescriptive } from "./prBodyDescriptive.js";
import { prBranchNonDefault } from "./prBranchNonDefault.js";
import { prForcePushAvoided } from "./prForcePushAvoided.js";
import { prLinkedIssue } from "./prLinkedIssue.js";
import { prTaskCompletion } from "./prTaskCompletion.js";
import { prTitleConventional } from "./prTitleConventional.js";
import { textImageAltText } from "./textImageAltText.js";
import { titleMeaningful } from "./titleMeaningful.js";

export const allRules = [
	commentMeaningful,
	prAutomationDetected,
	prBranchNonDefault,
	prBodyDescriptive,
	prForcePushAvoided,
	prLinkedIssue,
	prTaskCompletion,
	prTitleConventional,
	textImageAltText,
	titleMeaningful,
];
