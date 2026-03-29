import CategoryLinks from "./components/navbar/MainCategoryLinks";
import { DataFeed } from "./components/home/DataFeed";
import SearchInput from "../ui/search/SearchInput";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";

  return (
    <div className="space-y-8 py-6 px-2">
      <div className="max-w-4xl mx-auto w-full px-2">
        <SearchInput defaultValue={query} />
      </div>
      <CategoryLinks />
      <DataFeed query={query} />
    </div>
  );
}
