import { Octokit } from "octokit";
import type { RepositoryLocator } from "../types/data.js";
import type { CommentEntity, IssueData } from "../types/entities.js";
export declare function resolveCommentEntity(locator: RepositoryLocator, octokit: Octokit, issueData: IssueData, commentId: number): Promise<CommentEntity>;
//# sourceMappingURL=resolveCommentEntity.d.ts.map