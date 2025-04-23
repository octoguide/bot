import type { PartialDeep } from "type-fest";
import { Octokit } from "octokit";
import type { RepositoryLocator } from "../types/data.js";
import type { Entity, EntityType } from "../types/entities.js";
import type { Rule, RuleReporter } from "../types/rules.js";
export interface TestRuleContext {
    locator?: RepositoryLocator;
    octokit?: PartialDeep<Octokit>;
    report: RuleReporter;
}
export declare function testRule(rule: Rule, providedEntity: PartialDeep<Entity> & {
    type: EntityType;
}, context: TestRuleContext): Promise<void>;
//# sourceMappingURL=testRule.d.ts.map