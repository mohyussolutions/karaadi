import ContainerLinks from "./components/Cards/containerCards/conainerLinks";
import SearchInput from "../ui/search/SearchInput";
import CategoryLinks from "./components/navbar/categories/CategoryLinksClient";
import DataFeed from "./components/home/DataFeed";

export default function Home() {
  return (
    <div className="space-y-4 py-4 min-h-screen mt-2">
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
