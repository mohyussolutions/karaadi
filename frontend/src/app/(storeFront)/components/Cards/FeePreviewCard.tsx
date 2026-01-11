import { getActiveFee } from "@/actions/categories/feeAction";
import { useEffect, useState } from "react";

export const FeePreview = ({
  category,
  onCalculated,
}: {
  category: string;
  onCalculated: (val: number) => void;
}) => {
  const [fees, setFees] = useState<any>(null);

  useEffect(() => {
    getActiveFee().then((config: any) => {
      const baseFee = Number(config[category]) || 0;
      const taxRate = Number(config.taxRate) || 0;
      const platformFee = Number(config.platformFee) || 0;
      const taxAmount = (baseFee * taxRate) / 100;
      const totalAmount = baseFee + taxAmount + platformFee;

      setFees({
        baseFee,
        taxAmount,
        platformFee,
        totalAmount,
        isFree: totalAmount <= 0,
      });
      onCalculated(totalAmount);
    });
  }, [category, onCalculated]);

  if (!fees)
    return <div className="p-4 bg-gray-100 animate-pulse rounded-xl h-32" />;

  return (
    <div className="p-4 bg-white border rounded-2xl shadow-sm space-y-2 my-4">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Listing Fee</span>
        <span>${fees.baseFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Platform Fee</span>
        <span>${fees.platformFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500 border-b pb-2">
        <span>Tax</span>
        <span>${fees.taxAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg text-indigo-600 pt-1">
        <span>Total</span>
        <span>{fees.isFree ? "FREE" : `$${fees.totalAmount.toFixed(2)}`}</span>
      </div>
    </div>
  );
};
