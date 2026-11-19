import { createDefineRule } from "../createDefineRule.ts";
import { CoreRuleMetadata } from "../types/core.ts";

export const defineRule = createDefineRule<CoreRuleMetadata>(
	(about) => `https://octo.guide/rules/${about.name}`,
);
