import ContainerLinks from "./components/Cards/containerCards/conainerLinks";
import SearchInput from "../ui/search/SearchInput";
import CategoryLinks from "./components/navbar/categories/CategoryLinksClient";
import DataFeed from "./components/home/DataFeed";

export default function Home() {
  return (
    <div className="space-y-8 pb-8 min-h-screen">
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
