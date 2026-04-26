export const useIsValidPhone = (phone: string): boolean => {
  const clean = phone.replace(/\s/g, "");
  if (clean.startsWith("+252")) return /^\+252\d{9}$/.test(clean);
  if (clean.startsWith("6")) return /^6\d{8}$/.test(clean);
  return false;
};
