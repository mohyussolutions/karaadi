const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export const BASE_API_URL = raw.replace(/^(https:\/\/.+):8080(\/|$)/, "$1$2");
