import React from "react";

// --- Hard-Coded Approval Data ---
const approvalData = [
  {
    id: "APRV-001",
    requester: "Alex Johnson",
    requestType: "Annual Leave Request",
    status: "Pending",
    submissionDate: "2025-11-28",
    amount: null,
  },
  {
    id: "APRV-002",
    requester: "Sarah Lee",
    requestType: "Budget Transfer",
    status: "Pending",
    submissionDate: "2025-12-05",
    amount: 1500,
  },
  {
    id: "APRV-003",
    requester: "Mark Vitti",
    requestType: "Software License Renewal",
    status: "Approved",
    submissionDate: "2025-11-20",
    amount: 4999,
  },
  {
    id: "APRV-004",
    requester: "Jessica Chen",
    requestType: "Expense Report",
    status: "Rejected",
    submissionDate: "2025-12-08",
    amount: 325.5,
  },
  {
    id: "APRV-005",
    requester: "David Kim",
    requestType: "Training Course Enrollment",
    status: "Pending",
    submissionDate: "2025-12-10",
    amount: 199,
  },
];

const getStatusClasses = (status: any) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    case "Pending":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const formatCurrency = (amount: any) => {
  if (amount === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

function Approvals() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Pending Approvals
      </h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requester
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {approvalData.map((approval) => (
              <tr key={approval.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {approval.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {approval.requester}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {approval.requestType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(approval.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {approval.submissionDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                      approval.status
                    )}`}
                  >
                    {approval.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={`/approvals/${approval.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Review
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Approvals;
