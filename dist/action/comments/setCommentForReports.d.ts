import type { Octokit } from "octokit";
import type { RepositoryLocator } from "../../types/data.js";
import type { Entity } from "../../types/entities.js";
import type { RuleReport } from "../../types/rules.js";
export interface ReportComment {
    status: "created" | "existing";
    url: string;
}
export declare function getCommentForReports(entity: Entity, locator: RepositoryLocator, octokit: Octokit, reports: RuleReport[]): Promise<ReportComment | undefined>;
//# sourceMappingURL=setCommentForReports.d.ts.map