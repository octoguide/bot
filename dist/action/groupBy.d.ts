import "core-js/proposals/array-grouping-v2.js";
import _ from "lodash";
declare const groupBy: {
    <T>(collection: _.List<T> | null | undefined, iteratee?: _.ValueIteratee<T>): _.Dictionary<T[]>;
    <T extends object>(collection: T | null | undefined, iteratee?: _.ValueIteratee<T[keyof T]>): _.Dictionary<Array<T[keyof T]>>;
};
export { groupBy };
//# sourceMappingURL=groupBy.d.ts.map