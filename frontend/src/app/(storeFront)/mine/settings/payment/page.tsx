"use client";
import React, { useState } from "react";

interface PaymentItem {
  id: number;
  item: string;
  date: string;
  waafiNumber: string;
  status: "Paid" | "Pending" | "Failed";
}

const paymentList: PaymentItem[] = [
  {
    id: 1,
    item: "Boat Listing",
    date: "2025-09-10",
    amount: 25000,
    waafiNumber: "+252 61 123 4567",
    status: "Paid",
  },
  {
    id: 2,
    item: "Car Listing",
    date: "2025-09-12",
    amount: 10000,
    waafiNumber: "+252 61 987 6543",
    status: "Pending",
  },
  {
    id: 3,
    item: "Motorcycle Listing",
    date: "2025-09-14",
    amount: 7500,
    waafiNumber: "+252 61 555 1234",
    status: "Paid",
  },
];

const Payment: React.FC = () => {
  const userEmail = "user@example.com";
  const [userPhone, setUserPhone] = useState("+252 61 000 0000");
  const [savedPhone, setSavedPhone] = useState(userPhone);

  const handleSavePhone = () => {
    setSavedPhone(userPhone);
    alert(`Phone number updated to ${userPhone}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Waafi Payment Details</h1>

      <div className="mb-8">
        <p className="text-lg mb-2">
          <strong>Email:</strong> {userEmail}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <strong>Phone:</strong>
          <input
            type="text"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-lg"
          />
          <button
            onClick={handleSavePhone}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          >
            Update
          </button>
        </div>
        <p className="text-sm text-gray-500">Saved phone: {savedPhone}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
      <div className="border rounded-lg overflow-hidden shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Item</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Amount (SOS)</th>
              <th className="py-3 px-6 text-left">Waafi Number</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentList.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{payment.id}</td>
                <td className="py-3 px-6">{payment.item}</td>
                <td className="py-3 px-6">{payment.date}</td>
                <td className="py-3 px-6">
                  {payment.amount.toLocaleString()} SOS
                </td>
                <td className="py-3 px-6">{payment.waafiNumber}</td>
                <td
                  className={`py-3 px-6 font-semibold ${
                    payment.status === "Paid"
                      ? "text-green-600"
                      : payment.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;
