import ContainerLinks from "./components/Cards/containerCards/conainerLinks";
import SearchInput from "../ui/search/SearchInput";
import CategoryLinks from "./components/navbar/categories/CategoryLinksClient";
import DataFeed from "./components/home/DataFeed";

export default function Home() {
  return (
    <div className="space-y-6 sm:space-y-8 min-h-screen" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 5rem)" }}>
      <ContainerLinks>
        <SearchInput />
      </ContainerLinks>
      <ContainerLinks>
        <CategoryLinks />
      </ContainerLinks>
      <ContainerLinks>
        <DataFeed />
      </ContainerLinks>
    </div>
  );
}
