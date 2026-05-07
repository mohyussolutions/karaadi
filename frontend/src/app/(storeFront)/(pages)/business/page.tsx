import { redirect } from "next/navigation";

export default function BusinessIndexPage() {
  redirect("/business/post");
}

/*import BusinesscheckupSteps from "../../components/checkout/BusinesscheckupSteps";

export const dynamic = "force-dynamic";

export default function BusinessIndexPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <BusinesscheckupSteps active={1} />
      <h1 className="text-2xl font-bold mb-4">Business Dashboard</h1>
      <p className="text-gray-600">
        Welcome to the business section. Please select an action from the menu.
      </p>
    </div>
  );
}*/
