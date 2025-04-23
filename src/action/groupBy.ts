// Object.groupBy is not a function
// https://github.com/actions/runner/issues/3600
import "core-js/proposals/array-grouping-v2";

export { groupBy } from "lodash";
