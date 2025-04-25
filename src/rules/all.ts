import type { Rule } from "../types/rules.js";

import { commentMeaningless } from "./commentMeaningless.js";
import { issueRequiredFieldsContent } from "./issueRequiredFieldsContent.js";
import { prBranchNonDefault } from "./prBranchNonDefault.js";
import { prLinkedIssue } from "./prLinkedIssue.js";
import { prTaskCompletion } from "./prTaskCompletion.js";
import { prTitleConventional } from "./prTitleConventional.js";
import { textImageAltText } from "./textImageAltText.js";

export const rules: Rule[] = [
	commentMeaningless,
	issueRequiredFieldsContent,
	prBranchNonDefault,
	prLinkedIssue,
	prTaskCompletion,
	prTitleConventional,
	textImageAltText,
];
