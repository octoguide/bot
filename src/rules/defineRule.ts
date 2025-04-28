import { createDefineRule } from "../createDefineRule.js";
import { CoreRuleMetadata } from "../types/core.js";

export const defineRule = createDefineRule<CoreRuleMetadata>(
	(about) => `https://octo.guide/rules/${about.name}.md`,
);
