import { validateProps } from "../types/index.ts";

const passwordRegex =
  /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export const useValidateTheUser = async ({
  username,
  email,
  password,
}: validateProps) => {
  if (!username?.trim())
    return { success: false, error: "Please provide a valid username!!" };
  if (!emailRegex.test(email))
    return { success: false, error: "Please enter a valid email address!!" };
  if (!passwordRegex.test(password)) {
    return {
      success: false,
      error:
        "Password must be 8-32 characters with uppercase, lowercase, number, and special character.",
    };
  }
  return { success: true, message: "Validation passed successfully." };
};
