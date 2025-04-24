import type { Octokit } from "octokit";
import type { RepositoryLocator } from "../../types/data.js";
import type { CommentData, Entity } from "../../types/entities.js";
import type { RuleReport } from "../../types/rules.js";
export declare function updateExistingCommentForReports(entity: Entity, existingComment: CommentData, locator: RepositoryLocator, octokit: Octokit, reports: RuleReport[]): Promise<void>;
//# sourceMappingURL=updateExistingCommentForReports.d.ts.map