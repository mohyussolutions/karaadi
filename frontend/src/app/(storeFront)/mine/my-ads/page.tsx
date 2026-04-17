import { getMyAds } from "@/actions/core/my-adsAction";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import MyAdsClient from "./MyAdsClient";

export const dynamic = "force-dynamic";

export default async function MyAdsPage() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("idToken")?.value ||
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const ads = await getMyAds(token);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Ads</h1>
      <MyAdsClient initialAds={ads as any} />
    </div>
  );
}
