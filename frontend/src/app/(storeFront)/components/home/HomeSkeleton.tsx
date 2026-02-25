export function HomeSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div
        className="h-64 bg-gray-100 rounded-xl animate-pulse"
        style={{ animationDuration: "2s" }}
      />
      <div
        className="h-64 bg-gray-100 rounded-xl animate-pulse"
        style={{ animationDuration: "2s" }}
      />
    </div>
  );
}
