import React from "react";
import { FiDollarSign, FiCalendar, FiUser, FiBarChart2 } from "react-icons/fi";

const projectData = [
  // --- General & Infrastructure Projects (Condensed & Updated) ---
  {
    id: "P-702",
    title: "National IT Infrastructure Upgrade",
    category: "Development",
    status: "In Progress",
    budget: 85000,
    deadline: "2026-03-31",
    lead: "Anya Sharma",
    priority: "High",
    isRegional: false,
  },
  {
    id: "P-455",
    title: "Corporate HR Policy Review",
    category: "HR",
    status: "Pending Start",
    budget: 120000,
    deadline: "2026-06-01",
    lead: "Ben O'Reilly",
    priority: "Medium",
    isRegional: false,
  },
  {
    id: "P-990",
    title: "Quarterly Manager Documentation Update",
    category: "Management/Docs",
    status: "Completed",
    budget: 500,
    deadline: "2025-12-15",
    lead: "Corporate Planning",
    priority: "Low",
    isRegional: false,
  },
  // --- NEW MANAGER TASKS ---
  {
    id: "P-801",
    title: "New Market Account Onboarding Protocol",
    category: "Accounts",
    status: "In Progress",
    budget: 15000,
    deadline: "2026-01-30",
    lead: "Jane Doe (Accounts)",
    priority: "High",
    isRegional: false,
  },
  {
    id: "P-802",
    title: "East African Market Development Strategy",
    category: "Marketing",
    status: "Pending Start",
    budget: 25000,
    deadline: "2026-04-15",
    lead: "Mark Smith (Dev)",
    priority: "High",
    isRegional: false,
  },
  // --- Regional Projects ---
  {
    id: "P-101",
    title: "Galmudug Service Center Expansion",
    category: "Operations/Galmudug",
    status: "In Progress",
    budget: 45000,
    deadline: "2026-02-15",
    lead: "Regional Leader: Galmudug",
    priority: "High",
    isRegional: true,
  },
  {
    id: "P-202",
    title: "Puntland Market Entry Strategy",
    category: "Marketing/Puntland",
    status: "On Hold",
    budget: 30000,
    deadline: "2026-04-01",
    lead: "Regional Leader: Puntland",
    priority: "Medium",
    isRegional: true,
  },
  {
    id: "P-303",
    title: "Somaliland Logistics Network Optimization",
    category: "Logistics/Somaliland",
    status: "Completed",
    budget: 62000,
    deadline: "2025-11-28",
    lead: "Regional Leader: Somaliland",
    priority: "High",
    isRegional: true,
  },
  {
    id: "P-404",
    title: "Koofur Galbeed Regional Training Program",
    category: "Training/Koofur Galbeet",
    status: "In Progress",
    budget: 20000,
    deadline: "2026-03-01",
    lead: "Regional Leader: Koofur Galbeed",
    priority: "Medium",
    isRegional: true,
  },
  {
    id: "P-505",
    title: "Jubbaland Customer Feedback Initiative",
    category: "Customer Service/Jubbaland",
    status: "Pending Start",
    budget: 15000,
    deadline: "2026-05-10",
    lead: "Regional Leader: Jubbaland",
    priority: "Low",
    isRegional: true,
  },
  {
    id: "P-606",
    title: "Wagoori Bari Infrastructure Audit",
    category: "Audit/Wagoori Bari",
    status: "In Progress",
    budget: 18000,
    deadline: "2026-01-30",
    lead: "Manager: Wagoori Bari",
    priority: "High",
    isRegional: true,
  },
  {
    id: "P-777",
    title: "Banadir Metropolitan Digital Campaign",
    category: "Marketing/Banadir",
    status: "In Progress",
    budget: 75000,
    deadline: "2026-04-10",
    lead: "Regional Leader: Banadir",
    priority: "High",
    isRegional: true,
  },
];

// Separate the data into two lists
const regionalProjects = projectData.filter((p) => p.isRegional);
const generalProjects = projectData.filter((p) => !p.isRegional);

const getStatusClasses = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "Pending Start":
      return "bg-yellow-100 text-yellow-700";
    case "On Hold":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const ProjectCard = ({ project }: { project: (typeof projectData)[0] }) => {
  const cardBgClass = "bg-white";
  const cardBorderClass = "border-gray-200";

  return (
    <div
      key={project.id}
      // Reduced size by using `p-4` instead of `p-6` on hover
      className={`${cardBgClass} border ${cardBorderClass} rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-500`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
            {project.category}
          </span>
          <span
            className={`px-2 py-1 text-xs leading-4 font-semibold rounded-full ${getStatusClasses(
              project.status
            )}`}
          >
            {project.status}
          </span>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer">
          {project.title}
        </h2>
        {/* Project ID moved inline with the details to save space */}
        <p className="text-xs text-gray-400 mb-3">ID: {project.id}</p>

        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <FiUser className="mr-2 text-blue-500 text-base" />
            <span className="font-medium">Lead:</span> {project.lead}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <FiCalendar className="mr-2 text-gray-400 text-base" />
            <span className="font-medium">Deadline:</span> {project.deadline}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <FiDollarSign className="mr-2 text-green-500 text-base" />
            <span className="font-medium">Budget:</span>{" "}
            {formatCurrency(project.budget)}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <FiBarChart2 className="mr-2 text-yellow-500 text-base" />
            <span className="font-medium">Priority:</span> {project.priority}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 border-t flex justify-end">
        <a
          href={`/projects/${project.id}`}
          className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

function Projects() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Active Company Projects
      </h1>

      {/* REGIONAL PROJECTS SECTION */}
      <h2 className="text-2xl font-bold mb-4 text-gray-700 border-b pb-2">
        Regional Initiatives
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {regionalProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* GENERAL PROJECTS SECTION */}
      <h2 className="text-2xl font-bold mb-4 text-gray-700 border-b pb-2">
        General & Infrastructure Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generalProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

export default Projects;
