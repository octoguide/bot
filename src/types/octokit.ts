import type { Octokit } from "octokit";

/**
 * Request parameters filled in from a repository locator.
 */
interface LocatorParameters {
	owner: string;
	repo: string;
}

/**
 * Request parameters with `owner` and `repo` made optional.
 * @remarks Octokit's parameters intersect with an index signature, so `Omit`
 * would collapse them down to that index signature. Remapping keys preserves
 * each individual parameter.
 */
type WithOptionalLocator<MethodParameters> = Partial<LocatorParameters> & {
	[
		Key in keyof MethodParameters as Key extends keyof LocatorParameters
			? never
			: Key
	]: MethodParameters[Key];
};

/**
 * Additional call signature for a method that takes `owner` and `repo`.
 */
type WithOptionalLocatorMethod<Method extends (...args: never[]) => unknown> =
	NonNullable<Parameters<Method>[0]> extends LocatorParameters
		? (
				parameters?: WithOptionalLocator<NonNullable<Parameters<Method>[0]>>,
			) => ReturnType<Method>
		: Method;

/**
 * Recursively walks Octokit's `rest.*` API namespaces, relaxing each method.
 */
type WithOptionalLocators<Methods> = {
	[Key in keyof Methods]: Methods[Key] extends (...args: never[]) => unknown
		? WithOptionalLocatorMethod<Methods[Key]>
		: WithOptionalLocators<Methods[Key]>;
};

/**
 * Octokit whose `owner` and `repo` parameters default to a repository locator.
 * @see `locateOctokit` to create one.
 */
export type LocatedOctokit = Omit<Octokit, "rest"> & {
	rest: WithOptionalLocators<Octokit["rest"]>;
};
