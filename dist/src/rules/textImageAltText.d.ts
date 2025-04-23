import type { Entity } from "../types/entities.js";
import type { RuleContext } from "../types/rules.js";
export declare const textImageAltText: {
    about: {
        config: "recommended";
        description: string;
        name: string;
    };
    comment: typeof checkEntity;
    issue: typeof checkEntity;
    pullRequest: typeof checkEntity;
};
declare function checkEntity(context: RuleContext, entity: Entity): undefined;
export {};
//# sourceMappingURL=textImageAltText.d.ts.map