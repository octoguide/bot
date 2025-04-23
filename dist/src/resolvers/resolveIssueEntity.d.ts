import { Octokit } from "octokit";
import type { RepositoryLocator } from "../types/data.js";
import type { IssueEntity } from "../types/entities.js";
export declare function resolveIssueEntity(locator: RepositoryLocator, octokit: Octokit, id: number): Promise<IssueEntity>;
//# sourceMappingURL=resolveIssueEntity.d.ts.map