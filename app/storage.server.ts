import { readFileSync, writeFileSync } from "fs";

export type StorageData = {
  [userId: string]: string[];
};

export const getStorageData = (): StorageData => {
  return JSON.parse(readFileSync("./storage/data.json").toString());
};

export const setStorageData = (data: StorageData): void => {
  writeFileSync("./storage/data.json", JSON.stringify(data, null, 2));
};

export const getUserComparisonProducts = (userId: string): string[] | undefined => {
  const data = getStorageData();
  return data[userId];
};

export const initUserComparisonProducts = (userId: string): void => {
  const data = getStorageData();
  data[userId] = [];
  setStorageData(data);
};

export const addProductToComparison = (userId: string, productId: string): void => {
  const data = getStorageData();
  data[userId].push(productId);
  setStorageData(data);
};

export const removeProductFromComparison = (userId: string, productId: string): void => {
  const data = getStorageData();
  data[userId] = data[userId].filter((id: string): boolean => id !== productId);
  setStorageData(data);
};

export const toggleProductInComparison = (userId: string, productId: string): void => {
  const products = getUserComparisonProducts(userId);

  if (products?.includes(productId)) {
    removeProductFromComparison(userId, productId);
  } else {
    addProductToComparison(userId, productId);
  }
};
