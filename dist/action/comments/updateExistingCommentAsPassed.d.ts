import type { Octokit } from "octokit";
import type { RepositoryLocator } from "../../types/data.js";
import type { CommentData, Entity } from "../../types/entities.js";
export declare function updateExistingCommentAsPassed(entity: Entity, existingComment: CommentData, locator: RepositoryLocator, octokit: Octokit): Promise<void>;
//# sourceMappingURL=updateExistingCommentAsPassed.d.ts.map