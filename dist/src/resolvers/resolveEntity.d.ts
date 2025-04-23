import { Octokit } from "octokit";
import type { RepositoryLocator } from "../types/data.js";
import type { Entity } from "../types/entities.js";
export interface ResolvedLintable {
    entity: Entity;
    locator: RepositoryLocator;
}
export declare function resolveLintable(octokit: Octokit, url: string): Promise<ResolvedLintable | undefined>;
//# sourceMappingURL=resolveEntity.d.ts.map