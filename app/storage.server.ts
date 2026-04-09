import { readFileSync, writeFileSync } from "fs";

export type StorageData = {
  [id: string]: any
};

export const getStorageData = (): StorageData => {
  return JSON.parse(readFileSync("./storage/data.json").toString());
};

export const setStorageData = (data: StorageData): void => {
  writeFileSync("./storage/data.json", JSON.stringify(data, null, 2));
};
