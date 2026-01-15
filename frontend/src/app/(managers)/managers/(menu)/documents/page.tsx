export default function Page() {
  const title = "documents".charAt(0).toUpperCase() + "documents".slice(1);
  return (
    <div className="p-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
          {title}
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Management module for active {title.toLowerCase()} records.
        </p>
      </div>

      <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-slate-50 p-6 rounded-3xl mb-4">
          <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-slate-700">Module Initialized</h2>
        <p className="text-slate-400 max-w-xs text-center mt-2 font-medium">
          The database for this section is connected. Ready for data entry.
        </p>
      </div>
    </div>
  );
}
