import { Suspense } from "react";
import ContainerLinks from "./components/Cards/containerCards/conainerLinks";
import SearchInput from "../ui/search/SearchInput";
import CategoryLinks from "./components/navbar/categories/CategoryLinksClient";
import DataFeed from "./components/home/DataFeed";
import { main, mainStyle } from "@/app/utils/main.style";
import "@/app/utils/main.style.css";

export default function Home() {
  return (
    <div
      className={main.page}
      style={mainStyle.pagePadding}
    >
      <ContainerLinks>
        <SearchInput />
      </ContainerLinks>
      <ContainerLinks>
        <div className={main.catWrap}>
          <CategoryLinks />
        </div>
      </ContainerLinks>
      <ContainerLinks>
        <Suspense fallback={null}>
          <DataFeed />
        </Suspense>
      </ContainerLinks>
    </div>
  );
}
