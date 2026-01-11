import { v4 as uuidv4 } from "uuid";

export const generateId = (): string => {
  return uuidv4();
};

export const generateShortId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
