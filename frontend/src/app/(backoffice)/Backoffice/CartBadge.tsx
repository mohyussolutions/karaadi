"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { CiShoppingCart } from "react-icons/ci";
import { Trash2, X } from "lucide-react";
import { RootState } from "@/app/(storeFront)/store/store";
import { removeFee } from "@/app/(storeFront)/store/slices/feesSlice";
import { removeBoat } from "@/app/(storeFront)/store/slices/boatsSlice";
import { removeCar } from "@/app/(storeFront)/store/slices/carsSlice";

type FeeItem = {
  id: string;
  query: string;
  fee: {
    totalAmount: number;
    currency: string;
  };
};

export default function CartBadge() {
  const dispatch = useDispatch();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const fees = useSelector(
    (state: RootState) => (state as any).fees || [],
  ) as FeeItem[];
  const boatSelection = useSelector(
    (state: RootState) => state.boats?.userSelection,
  );
  const carSelection = useSelector(
    (state: RootState) => (state as any).cars?.userSelection,
  );
  const boats = useSelector((state: RootState) => state.boats?.boats || []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showBoatSelection =
    boatSelection && !boats.some((b) => b.id === boatSelection.id);

  const boatTotal = boats.reduce((sum, boat) => sum + (boat.price || 0), 0);
  const draftTotal =
    (showBoatSelection ? boatSelection.price || 0 : 0) +
    (carSelection ? carSelection.price || 0 : 0);
  const feeTotal = fees.reduce(
    (sum, item) => sum + (item.fee?.totalAmount || 0),
    0,
  );

  const totalAmount = boatTotal + draftTotal + feeTotal;
  const currency = fees.length > 0 ? fees[0]?.fee?.currency : "USD";

  const handleRemoveFee = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(removeFee(id));
  };

  const handleRemoveBoat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(removeBoat(id));
  };

  const handleRemoveBoatDraft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (boatSelection?.id) dispatch(removeBoat(boatSelection.id));
  };

  const handleRemoveCarDraft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (carSelection?.id) dispatch(removeCar(carSelection.id));
  };

  const navigateTo = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handleShowDetails = (item: any) => {
    if (item && item.id) {
      router.push(`/Backoffice/summary/summaryBoat/${item.id}`);
      setOpen(false);
    }
  };

  const totalCount =
    fees.length +
    boats.length +
    (showBoatSelection ? 1 : 0) +
    (carSelection ? 1 : 0);
  const hasItems = totalCount > 0;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
      >
        <CiShoppingCart size={24} />
        {hasItems && (
          <span className="absolute top-0 right-0 flex items-center justify-center rounded-full bg-red-600 h-5 w-5 text-[10px] font-bold text-white shadow-sm translate-x-1 -translate-y-1">
            {totalCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {!hasItems ? (
              <div className="text-center text-gray-400 py-10 flex flex-col items-center gap-2">
                <CiShoppingCart size={40} className="opacity-20" />
                <p className="text-sm font-medium">Your cart is empty</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="pb-3 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Cart Summary
                  </span>
                  <span className="text-sm font-bold text-indigo-600">
                    {currency} {totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {fees.map((item) => (
                    <div
                      key={item.id}
                      className="group p-3 bg-gray-50 border border-transparent rounded-lg hover:border-gray-200 transition-all cursor-pointer"
                      onClick={() => handleShowDetails(item)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-bold text-gray-900 truncate">
                            {item.query}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            ID: {item.id.slice(0, 8)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-600 whitespace-nowrap">
                            {item.fee?.totalAmount.toFixed(2)}
                          </span>
                          <button
                            onClick={(e) => handleRemoveFee(e, item.id)}
                            className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {boats.length > 0 && (
                  <div className="mt-2 pt-3 border-t border-gray-100">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">
                      My Boats
                    </p>
                    {boats.map((boat) => (
                      <div
                        key={boat.id}
                        onClick={() => handleShowDetails(boat)}
                        className="group relative p-3 bg-slate-900 rounded-xl text-white shadow-md cursor-pointer hover:bg-slate-800 transition-colors mb-2"
                      >
                        <button
                          onClick={(e) => handleRemoveBoat(e, boat.id)}
                          className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <X size={10} />
                        </button>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs truncate w-32">
                            {boat.title}
                          </span>
                          <span className="text-xs font-black text-blue-400">
                            ${boat.price}
                          </span>
                        </div>
                        <p className="text-[9px] opacity-60 uppercase">
                          {boat.city} • {boat.listingType}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {showBoatSelection && (
                  <div className="mt-2 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                        Boat Draft
                      </p>
                      <button
                        onClick={handleRemoveBoatDraft}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div
                      onClick={() => handleShowDetails(boatSelection)}
                      className="p-3 bg-slate-900 rounded-xl text-white shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs truncate w-32">
                          {boatSelection.title}
                        </span>
                        <span className="text-xs font-black text-blue-400">
                          ${boatSelection.price}
                        </span>
                      </div>
                      <p className="text-[9px] opacity-60 uppercase">
                        {boatSelection.city} • {boatSelection.listingType}
                      </p>
                    </div>
                  </div>
                )}

                {carSelection && (
                  <div className="mt-2 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                        Car Draft
                      </p>
                      <button
                        onClick={handleRemoveCarDraft}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div
                      onClick={() => handleShowDetails(carSelection)}
                      className="p-3 bg-slate-900 rounded-xl text-white shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs truncate w-32">
                          {carSelection.title}
                        </span>
                        <span className="text-xs font-black text-emerald-400">
                          ${carSelection.price}
                        </span>
                      </div>
                      <p className="text-[9px] opacity-60 uppercase">
                        {carSelection.city} • {carSelection.listingType}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => navigateTo("/Backoffice/payment/checkout")}
                    className="w-full py-3 bg-indigo-600 text-white text-[11px] font-black rounded-xl hover:bg-indigo-700 transition-colors uppercase tracking-widest"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
