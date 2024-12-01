import { FileObj, FlatterType } from "../types";

export function flattenArr<T extends FlatterType>(arr: T[]) {
  return arr.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {} as FileObj<T>);
}

export function objToArr<T>(obj: FileObj<T>) {
  return Object.keys(obj).map((key) => obj[key]);
}
