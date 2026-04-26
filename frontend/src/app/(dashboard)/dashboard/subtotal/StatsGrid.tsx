import { Suspense } from "react";
import TotalUsers from "./TotalUsers";
import TotalVisited from "./TotalVisited";
import TotalMessages from "./TotalMessages";
import TotalAdvertisements from "./TotalAdvertisements";
import TotalSubscriptions from "./TotalSubscriptions";
import TotalRegions from "./TotalRegions";
import TotalCities from "./TotalCities";

const Skeleton = () => (
  <div className="h-12 w-20 bg-gray-100 rounded-lg animate-pulse" />
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-4 flex items-center gap-3 min-w-0">
    {children}
  </div>
);

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      <Card>
        <Suspense fallback={<Skeleton />}>
          <TotalUsers />
        </Suspense>
      </Card>
      <Card>
        <Suspense fallback={<Skeleton />}>
          <TotalVisited />
        </Suspense>
      </Card>
      <Card>
        <Suspense fallback={<Skeleton />}>
          <TotalMessages />
        </Suspense>
      </Card>
      <Card>
        <Suspense fallback={<Skeleton />}>
          <TotalAdvertisements />
        </Suspense>
      </Card>
      <Card>
        <Suspense fallback={<Skeleton />}>
          <TotalSubscriptions />
        </Suspense>
      </Card>
      <Card>
        <Suspense fallback={<Skeleton />}>
          <TotalRegions />
        </Suspense>
      </Card>
      <Card>
        <Suspense fallback={<Skeleton />}>
          <TotalCities />
        </Suspense>
      </Card>
    </div>
  );
}
