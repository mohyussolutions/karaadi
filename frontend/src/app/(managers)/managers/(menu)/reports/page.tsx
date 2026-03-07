export default function Page() {
  return (
    <div className="w-full h-full min-w-0 min-h-screen p-6 md:p-8 lg:p-10 space-y-6 bg-gray-200">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
          Reports
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          View and generate reports for your team.
        </p>
      </div>

      <div className="w-full h-[70vh] bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center">
        <div className="bg-slate-50 p-6 rounded-3xl mb-4">
          <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-slate-700">Reports Module</h2>
        <p className="text-slate-400 max-w-xs text-center mt-2 font-medium">
          Your reports and analytics will appear here.
        </p>
      </div>
    </div>
  );
}
