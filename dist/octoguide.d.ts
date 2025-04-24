import type { Octokit } from "octokit";
import type { RepositoryLocator } from "./types/data.js";
import type { Entity } from "./types/entities.js";
import type { RuleReport } from "./types/rules.js";
export interface OctoGuideResult {
    entity: Entity;
    locator: RepositoryLocator;
    octokit: Octokit;
    reports: RuleReport[];
}
export interface OctoGuideSettings {
    githubToken?: string | undefined;
    url: string;
}
export declare function runOctoGuide({ githubToken, url, }: OctoGuideSettings): Promise<OctoGuideResult>;
