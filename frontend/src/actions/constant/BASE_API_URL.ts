const url = process.env.NEXT_PUBLIC_API_URL;
if (!url) throw new Error("NEXT_PUBLIC_API_URL is not set");
export const BASE_API_URL = url;
