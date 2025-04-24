// Object.groupBy is not a function
// https://github.com/actions/runner/issues/3600
import "core-js/proposals/array-grouping-v2.js";
import _ from "lodash";

// I promise this works.
// eslint-disable-next-line @typescript-eslint/unbound-method
const { groupBy } = _;

export { groupBy };
