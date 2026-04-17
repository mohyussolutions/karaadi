import { Suspense } from "react";
import ContainerLinks from "./components/Cards/containerCards/conainerLinks";
import SearchInput from "../ui/search/SearchInput";
import CategoryLinks from "./components/navbar/categories/MainCategoryLinks";
import DataFeed from "./components/home/DataFeed";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <div className="space-y-4 py-4 min-h-screen mt-2">
      <ContainerLinks>
        <Suspense
          fallback={
            <div className="h-12 w-full rounded-xl bg-gray-200 animate-pulse" />
          }
        >
          <SearchBarServer searchParams={searchParams} />
        </Suspense>
      </ContainerLinks>
      <ContainerLinks>
        <CategoryLinks />
      </ContainerLinks>
      <ContainerLinks>
        <Suspense fallback={<CardGridSkeleton />}>
          <DataFeedServer searchParams={searchParams} />
        </Suspense>
      </ContainerLinks>
    </div>
  );
}

async function SearchBarServer({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <SearchInput defaultValue={q || ""} />;
}

async function DataFeedServer({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <DataFeed query={q || ""} />;
}

function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4 animate-pulse">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="h-64 rounded-2xl bg-gray-100" />
      ))}
    </div>
  );
}
