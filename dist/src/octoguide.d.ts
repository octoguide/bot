import type { RuleReport } from "./types/rules.js";
export interface OctoGuideSettings {
    githubToken?: string | undefined;
    url: string;
}
export declare function runOctoGuide({ githubToken, url }: OctoGuideSettings): Promise<RuleReport[]>;
//# sourceMappingURL=octoguide.d.ts.map