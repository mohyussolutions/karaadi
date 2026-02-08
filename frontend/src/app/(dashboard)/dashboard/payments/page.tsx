import React from "react";
import {
  getAllPaymentsAction,
  getPaymentStatsAction,
  deletePaymentAction,
} from "@/actions/categories/paymentActions";
import TransactionTable from "./TransactionTable";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page =
    typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1;
  const status =
    typeof resolvedParams.status === "string"
      ? resolvedParams.status
      : undefined;

  try {
    const [paymentsData, statsData] = await Promise.all([
      getAllPaymentsAction({ page, status, limit: 50 }),
      getPaymentStatsAction(),
    ]);

    const handleDelete = async (id: string) => {
      "use server";
      await deletePaymentAction(id);
    };

    const cur = (val: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(val || 0);

    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Payments & Revenue
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Management of transactions and financial breakdowns.
              </p>
            </div>

            <div className="flex items-center gap-6 bg-white p-4 rounded-3xl border border-slate-200/60 shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Tax Collected
                </span>
                <span className="text-lg font-black text-slate-900">
                  {cur(statsData?.summary.totalTax || 0)}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-slate-100" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Platform Fees
                </span>
                <span className="text-lg font-black text-emerald-600">
                  {cur(statsData?.summary.totalPlatformFee || 0)}
                </span>
              </div>
            </div>
          </div>

          <TransactionTable
            payments={paymentsData?.payments || []}
            stats={statsData}
            onDelete={handleDelete}
            onUserClick={async (userId) => {
              "use server";
              console.log(userId);
            }}
          />

          {paymentsData?.total > 0 && (
            <div className="flex items-center justify-between bg-white p-4 rounded-[2rem] border border-slate-200/60 shadow-sm">
              <p className="text-xs font-bold text-slate-400 px-4">
                Displaying {paymentsData.payments.length} of{" "}
                {paymentsData.total} transactions
              </p>
              <div className="flex gap-2">
                <button className="px-6 py-2 hover:bg-slate-50 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest transition-all">
                  Previous
                </button>
                <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md">
                  Next Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 bg-rose-50 rounded-full">
          <svg
            className="w-8 h-8 text-rose-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-black text-slate-900">
          API Connection Error
        </h2>
        <p className="text-slate-500 max-w-xs text-center text-sm font-medium">
          We couldn't fetch the payment data. Please verify your backend server.
        </p>
      </div>
    );
  }
}
