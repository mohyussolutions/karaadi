export const toBool = (
  value: boolean | string | number | undefined,
): boolean => {
  if (value === undefined) return false;
  return value === true || value === "true" || value === 1 || value === "1";
};
