import React from "react";
// FIX: FiFileSpreadsheet is REMOVED and FiFileText (which is imported) will be used for XLSX to avoid the export error.
import { FiFile, FiFileText, FiFileMinus, FiFilePlus } from "react-icons/fi";

// --- Hard-Coded Document Data (Unchanged) ---
const documentData = [
  {
    id: "DOC-001",
    name: "Q4 2025 Financial Report",
    type: "PDF",
    uploadedBy: "Finance Dept.",
    lastModified: "2025-12-01",
    size: "1.2 MB",
    access: "Private",
  },
  {
    id: "DOC-002",
    name: "Employee Handbook v3.1",
    type: "DOCX",
    uploadedBy: "HR Dept.",
    lastModified: "2025-11-15",
    size: "850 KB",
    access: "Public",
  },
  {
    id: "DOC-003",
    name: "Marketing Strategy Q1 2026",
    type: "PPTX",
    uploadedBy: "Marketing Team",
    lastModified: "2025-12-10",
    size: "5.5 MB",
    access: "Team Only",
  },
  {
    id: "DOC-004",
    name: "Server Migration Plan",
    type: "XLSX",
    uploadedBy: "IT Operations",
    lastModified: "2025-10-25",
    size: "210 KB",
    access: "Private",
  },
  {
    id: "DOC-005",
    name: "Code of Conduct",
    type: "PDF",
    uploadedBy: "Legal",
    lastModified: "2025-09-01",
    size: "420 KB",
    access: "Public",
  },
];
// ---------------------------------

// Helper functions for styling and icons
const getFileIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case "PDF":
      return <FiFileText className="text-red-500" />;
    case "DOCX":
      return <FiFilePlus className="text-blue-500" />;
    case "XLSX":
      // FIX: Changed FiFileSpreadsheet to FiFileText to fix the import error.
      return <FiFileText className="text-green-500" />;
    case "PPTX":
      return <FiFileMinus className="text-orange-500" />;
    default:
      return <FiFile className="text-gray-400" />;
  }
};

const getAccessClasses = (access: any) => {
  switch (access) {
    case "Private":
      return "bg-red-100 text-red-700";
    case "Team Only":
      return "bg-yellow-100 text-yellow-700";
    case "Public":
    default:
      return "bg-green-100 text-green-700";
  }
};

function Documents() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Company Documents
      </h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Access
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Modified
              </th>
              <th className="px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documentData.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getFileIcon(doc.type)}</span>
                    {doc.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.uploadedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${getAccessClasses(
                      doc.access
                    )}`}
                  >
                    {doc.access}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.lastModified}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={`/documents/${doc.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
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

export default Documents;
