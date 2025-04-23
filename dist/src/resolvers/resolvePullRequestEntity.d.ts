import { Octokit } from "octokit";
import type { RepositoryLocator } from "../types/data.js";
import type { PullRequestEntity } from "../types/entities.js";
export declare function resolvePullRequestEntity(locator: RepositoryLocator, octokit: Octokit, id: number): Promise<PullRequestEntity>;
//# sourceMappingURL=resolvePullRequestEntity.d.ts.map