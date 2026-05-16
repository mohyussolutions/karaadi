const bars = (n: number, cls: string) =>
  Array.from({ length: n }, (_, i) => <div key={i} className={cls} />);

export const FeedGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3 animate-pulse">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="aspect-[4/3] bg-gray-200" />
        <div className="p-2.5 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

export const StoreFrontSkeleton = () => (
  <div className="space-y-2 py-1 px-3 min-h-screen animate-pulse">
    <div className="w-full p-2 border border-gray-300 rounded-xl">
      <div className="h-10 w-full rounded-lg bg-gray-100" />
    </div>
    <div className="w-full p-2 border border-gray-300 rounded-xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-2 py-4 max-w-7xl mx-auto">
        {bars(8, "h-14 rounded-xl bg-gray-100")}
      </div>
    </div>
    <div className="w-full p-2 border border-gray-300 rounded-xl">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4">
        {bars(20, "h-64 rounded-2xl bg-gray-100")}
      </div>
    </div>
  </div>
);

export const SubNavbarSkeleton = () => (
  <div className="container mx-auto px-2 py-2 space-y-4 animate-pulse">
    <div className="h-11 bg-gray-200 rounded-lg w-full" />
    <div className="h-4 bg-gray-100 rounded w-40" />
    <div className="flex gap-2 overflow-hidden">
      {bars(6, "h-9 bg-gray-200 rounded-full w-20 flex-shrink-0")}
    </div>
    <div className="h-16 bg-gray-100 rounded-lg w-full" />
    <div className="h-5 bg-gray-100 rounded w-48" />
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="h-48 bg-gray-200" />
          <div className="p-3 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TableSkeleton = ({ headerCols, rowCols, rows, avatarSize }: {
  headerCols: number;
  rowCols: number;
  rows: number;
  avatarSize?: string;
}) => (
  <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 flex gap-4">
      {bars(headerCols, "h-4 bg-gray-200 rounded flex-1")}
    </div>
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="px-4 py-4 flex gap-4 border-t border-gray-100">
        {avatarSize && <div className={`${avatarSize} bg-gray-200 rounded-full flex-shrink-0`} />}
        {bars(rowCols, "h-4 bg-gray-100 rounded flex-1")}
      </div>
    ))}
  </div>
);

export const CategoriesTableSkeleton = () => (
  <div className="w-full min-h-screen bg-gray-50">
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-6 bg-gray-100 rounded-full w-20 ml-auto" />
      </div>
      <div className="flex gap-2 mb-6 overflow-hidden">
        {bars(5, "h-9 bg-gray-200 rounded-lg w-24 flex-shrink-0")}
      </div>
      <TableSkeleton headerCols={6} rowCols={5} rows={8} avatarSize="w-12 h-12" />
    </div>
  </div>
);

export const PaymentsSkeleton = () => (
  <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div className="h-7 bg-gray-200 rounded w-56" />
      <div className="h-8 bg-blue-100 rounded-full w-20" />
    </div>
    <div className="flex gap-2 mb-6">
      {bars(5, "h-8 bg-gray-200 rounded-full w-24")}
    </div>
    <div className="overflow-x-auto">
      <div className="flex gap-4 px-4 py-4 border-b border-gray-100">
        {bars(6, "h-4 bg-gray-200 rounded flex-1")}
      </div>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex gap-4 px-4 py-4 border-b border-gray-50">
          {bars(6, "h-4 bg-gray-100 rounded flex-1")}
        </div>
      ))}
    </div>
  </div>
);

export const UsersSkeleton = () => (
  <div className="w-full min-h-screen bg-gray-50 animate-pulse">
    <div className="w-full px-4 sm:px-6 py-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-7 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-100 rounded w-36" />
        </div>
      </div>
      <div className="h-12 bg-gray-200 rounded-xl mb-6 w-full" />
      <TableSkeleton headerCols={6} rowCols={5} rows={8} avatarSize="w-10 h-10" />
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="p-6 bg-white rounded-xl shadow-sm border min-h-[140px] animate-pulse">
    <div className="h-4 bg-gray-100 rounded w-2/3 mb-4" />
    <div className="h-8 bg-gray-100 rounded w-1/2" />
  </div>
);

export const CircleSkeleton = () => (
  <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse" />
);

export const TableRowSkeleton = ({ cols = 5 }: { cols?: number }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }, (_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gray-100 rounded w-full" />
      </td>
    ))}
  </tr>
);

export const CardSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse ${className}`} />
);

export const PageSkeleton = () => (
  <div className="m-10 flex flex-col gap-8 animate-pulse">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 place-items-center py-6">
      {Array.from({ length: 6 }, (_, i) => <CircleSkeleton key={i} />)}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full px-2 py-4">
      {Array.from({ length: 12 }, (_, i) => <StatCardSkeleton key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 m-6">
      <CardSkeleton className="min-h-[350px]" />
      <CardSkeleton className="min-h-[350px]" />
    </div>
  </div>
);
