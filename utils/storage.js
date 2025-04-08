// utils/storage.js
export const getLocalStorageItem = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

export const setLocalStorageItem = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};
