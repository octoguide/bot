import { createDefineRule } from "../createDefineRule";
import { CoreRuleMetadata } from "../types/core";

export const defineRule = createDefineRule<CoreRuleMetadata>(
	(about) =>
		`https://github.com/JoshuaKGoldberg/OctoGuide/blob/main/docs/rules/${about.name}.md`,
);
