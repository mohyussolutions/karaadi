export default function Loading() {
  return (
    <div className="space-y-2 py-1 px-3 min-h-screen animate-pulse">
      <div className="w-full p-2 border border-gray-300 rounded-xl">
        <div className="h-10 w-full rounded-lg bg-gray-100" />
      </div>
      <div className="w-full p-2 border border-gray-300 rounded-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-2 py-4 max-w-7xl mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
      <div className="w-full p-2 border border-gray-300 rounded-xl">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
