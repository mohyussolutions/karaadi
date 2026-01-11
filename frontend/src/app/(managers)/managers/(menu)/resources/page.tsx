"use client";
import React from "react";
import {
  FiTool,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiAlertTriangle,
  FiBarChart2,
  FiBriefcase,
} from "react-icons/fi";

const resourceData = [
  {
    id: 1,
    title: "Project & Task Board Access",
    description:
      "Link to the central platform (e.g., Trello or Asana) for logging bugs, tracking daily tasks, and viewing the current product roadmap and sprint goals.",
    category: "Development",
    link: "#",
    icon: "FiTool",
    accessLevel: "All Staff",
    priority: "High",
    detail: {
      owner: "Engineering Lead",
      tools: "Jira/Trello/Asana",
      lastUpdate: "2925-12-09",
      notes:
        "Ensure all engineers update their sprint tasks before the daily standup.",
    },
  },
  {
    id: 2,
    title: "Shared Cloud Drive Access",
    description:
      "The secure location for all critical company documentation, including legal agreements, HR policies, marketing assets, and internal templates. This is the source of truth.",
    category: "System",
    link: "#",
    icon: "FiSettings",
    accessLevel: "All Staff",
    priority: "High",
    detail: {
      owner: "IT Manager",
      tools: "Google Drive/Dropbox",
      lastUpdate: "2025-12-10",
      notes:
        "Strict permissions are set on the 'Finance' and 'Legal' folders. Request access via the IT Helpdesk.",
    },
  },
  {
    id: 3,
    title: "Team Contact List (Internal)",
    description:
      "A comprehensive list of all employee contact information (email, phone, internal chat handles) and their specific roles, essential for quick cross-departmental communication.",
    category: "HR",
    link: "#",
    icon: "FiUsers",
    accessLevel: "All Staff",
    priority: "Medium",
    detail: {
      owner: "HR Manager",
      tools: "Internal Directory System",
      lastUpdate: "2025-12-05",
      notes:
        "Please notify HR immediately of any changes in contact details or role.",
    },
  },
  {
    id: 4,
    title: "Financial Overview & Budget",
    description:
      "Access to the high-level dashboard displaying current cash flow, monthly expenses (burn rate), and projections for runway, typically required for management and founders.",
    category: "Finance",
    link: "#",
    icon: "FiDollarSign",
    accessLevel: "Founders/Managers",
    priority: "High",
    detail: {
      owner: "CFO / Finance Lead",
      tools: "Custom Dashboard",
      lastUpdate: "2025-12-11",
      notes:
        "Data is updated daily. All budget queries must be directed to the Finance Lead.",
    },
  },
  {
    id: 5,
    title: "Customer Support Issue Log",
    description:
      "Review current open tickets, identify recurring client issues, and track response times. Essential for improving service quality immediately.",
    category: "Support/Ops",
    link: "#",
    icon: "FiAlertTriangle",
    accessLevel: "Founders/Managers",
    priority: "Critical",
    detail: {
      owner: "Operations Manager",
      tools: "Zendesk/Intercom",
      lastUpdate: "2025-12-11",
      notes:
        "Critical priority issues (P1) must be resolved within 4 hours. Focus on the backlog!",
    },
  },
  {
    id: 6,
    title: "Monthly KPI Performance Report",
    description:
      "A simplified report showing sales goals vs. actuals, user churn rate, and key metrics that require urgent review or strategic adjustment.",
    category: "Reporting",
    link: "#",
    icon: "FiBarChart2",
    accessLevel: "Founders/Managers",
    priority: "High",
    detail: {
      owner: "COO / Data Analyst",
      tools: "Metabase/Tableau",
      lastUpdate: "2025-12-01",
      notes:
        "Next review meeting is scheduled for Monday at 10 AM to discuss Q4 results.",
    },
  },
];

const IconMap = {
  FiTool: FiTool,
  FiUsers: FiUsers,
  FiDollarSign: FiDollarSign,
  FiSettings: FiSettings,
  FiAlertTriangle: FiAlertTriangle,
  FiBarChart2: FiBarChart2,
  FiBriefcase: FiBriefcase,
};

const getAccessClass = (level) => {
  switch (level) {
    case "Founders/Managers":
      return "text-red-700 bg-red-100";
    case "All Staff":
    default:
      return "text-green-700 bg-green-100";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Critical":
      return "border-red-500 hover:shadow-red-200";
    case "High":
      return "border-yellow-500 hover:shadow-yellow-200";
    default:
      return "border-gray-200 hover:shadow-indigo-200";
  }
};

const ResourceCard = ({ resource, onViewDetails }) => {
  const ResourceIcon = IconMap[resource.icon];
  const priorityStyle = getPriorityColor(resource.priority);

  return (
    <div
      key={resource.id}
      className={`block bg-white p-6 rounded-xl shadow-lg border-b-4 ${priorityStyle} transition duration-300 transform hover:scale-[1.02]`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl text-indigo-600">
          {ResourceIcon ? <ResourceIcon /> : <FiTool />}
        </div>
        <div className="text-right space-y-1">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${getAccessClass(
              resource.accessLevel
            )}`}
          >
            {resource.accessLevel}
          </span>
          <p className="text-xs text-gray-500 uppercase font-medium">
            {resource.category}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h2>
      <p className="text-sm text-gray-600">{resource.description}</p>

      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500">
          ID: {resource.id}
        </span>
        <button
          onClick={() => onViewDetails(resource.id)}
          className="text-sm font-semibold text-indigo-600 flex items-center hover:text-indigo-800"
        >
          View Details
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ResourceDetail = ({ resource, onBack }) => {
  const DetailIcon = IconMap[resource.icon];

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border-t-4 border-indigo-500 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
      >
        <svg
          className="mr-2 h-4 w-4 transform rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
        Back to Resource List
      </button>

      <div className="flex items-center space-x-4 border-b pb-4 mb-4">
        <div className="text-5xl text-indigo-600">
          {DetailIcon ? <DetailIcon /> : <FiTool />}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{resource.title}</h2>
          <p className="text-md text-gray-500">
            Resource ID: {resource.id} &bull; Category: {resource.category}
          </p>
        </div>
      </div>

      <p className="text-lg mb-6 text-gray-700">{resource.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg border">
        <div>
          <p className="text-sm font-medium text-gray-500">Owner</p>
          <p className="text-lg font-semibold text-gray-800">
            {resource.detail.owner}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Associated Tools</p>
          <p className="text-lg font-semibold text-gray-800">
            {resource.detail.tools}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Last Updated</p>
          <p className="text-lg font-semibold text-gray-800">
            {resource.detail.lastUpdate}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Access Level</p>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${getAccessClass(
              resource.accessLevel
            )}`}
          >
            {resource.accessLevel}
          </span>
        </div>
      </div>

      <div className="mt-6 p-4 border-l-4 border-yellow-500 bg-yellow-50">
        <p className="text-sm font-medium text-yellow-700">
          Manager Notes / Action Required:
        </p>
        <p className="text-base text-yellow-800 mt-1">
          {resource.detail.notes}
        </p>
      </div>
    </div>
  );
};

function Resources() {
  const [selectedId, setSelectedId] = React.useState(null);

  const handleViewDetails = (id) => {
    setSelectedId(id);
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  const selectedResource = resourceData.find((r) => r.id === selectedId);

  if (selectedResource) {
    return (
      <div className="p-10 bg-gray-100 min-h-screen">
        <ResourceDetail resource={selectedResource} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="text-sm font-semibold uppercase text-indigo-700 mb-2 tracking-wider">
        Karaadi.com Internal (Startup Manager View)
      </div>

      <h1 className="text-4xl font-extrabold mb-10 text-gray-900">
        Essential Manager Resources
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resourceData.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </div>
  );
}

export default Resources;
