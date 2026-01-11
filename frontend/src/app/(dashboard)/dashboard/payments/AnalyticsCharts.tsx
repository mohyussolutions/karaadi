import { PaymentStats } from "@/actions/categories/paymentActions";

export default function AnalyticsCharts({
  stats,
}: {
  stats: PaymentStats | null;
}) {
  if (!stats) return null;
  const cur = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val || 0);
  const maxMethod = Math.max(
    ...stats.breakdown.paymentMethods.map((m) => m._sum.totalAmount)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
        <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-10">
          Revenue Distribution
        </h3>
        <div className="space-y-8">
          {stats.breakdown.paymentMethods.map((m) => (
            <div key={m.paymentMethod}>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-black uppercase">
                  {m.paymentMethod}
                </span>
                <span className="font-black">{cur(m._sum.totalAmount)}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-1000"
                  style={{
                    width: `${(m._sum.totalAmount / maxMethod) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] mb-10">
            System Performance
          </h3>
          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="text-[10px] text-indigo-400 font-black uppercase mb-1">
                Avg Ticket
              </p>
              <p className="text-3xl font-black italic tracking-tighter">
                {cur(stats.summary.averagePayment)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-rose-400 font-black uppercase mb-1">
                Tax Collected
              </p>
              <p className="text-3xl font-black italic tracking-tighter">
                {cur(stats.summary.totalTax)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
