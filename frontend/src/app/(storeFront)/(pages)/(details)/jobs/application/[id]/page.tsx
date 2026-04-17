import AppyClient from "../AppyClient";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";

interface Params {
  params: { id: string };
}

async function fetchJob(id: string) {
  try {
    const res = await fetch(`${BASE_API_URL}/api/jobs/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  } catch (e) {
    return null;
  }
}

export default async function Page({ params }: Params) {
  const { id } = await (params as any);
  const data = await fetchJob(id);

  if (!data) {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Job not found</h2>
          <p className="text-gray-600 mt-2">
            We couldn't find the job you're looking for.
          </p>
        </div>
      </div>
    );
  }

  const title = data.title || data.jobTitle || "";
  const company = data.companyName || data.company || data.company_name || "";

  return <AppyClient jobTitle={title} companyName={company} jobId={id} />;
}
