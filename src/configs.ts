import type { ConfigName } from "./types/configs.js";
import type { Rule } from "./types/rules.js";

import { groupBy } from "./action/groupBy.js";
import { rules } from "./rules/index.js";

export const configs = groupBy(rules, (rule) => rule.about.config) as Record<
	ConfigName,
	Rule[]
>;
