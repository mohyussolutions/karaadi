import { getMyAdById } from "@/actions/core/my-adsAction";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import EditClient from "./EditClient";

export const dynamic = "force-dynamic";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token =
    cookieStore.get("idToken")?.value ||
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const ad = await getMyAdById(id, token);

  if (!ad) {
    return (
      <div className="container mx-auto max-w-md p-6 mt-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">Error: Ad not found</p>
          <a
            href="/mine/my-ads"
            className="mt-4 inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Back to My Ads
          </a>
        </div>
      </div>
    );
  }

  return <EditClient ad={ad as any} />;
}
