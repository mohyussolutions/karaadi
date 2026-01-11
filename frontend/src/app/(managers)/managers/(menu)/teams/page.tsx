import React from "react";
import {
  FiUsers,
  FiCode,
  FiDollarSign,
  FiZap,
  FiTruck,
  FiMapPin,
  FiChevronRight,
} from "react-icons/fi";

const teamsData = [
  {
    id: "T001",
    name: "Software Development",
    manager: "Anya Sharma",
    members: 12,
    focus: "Product Features, Infrastructure",
    icon: FiCode,
    status: "High Load",
  },
  {
    id: "T002",
    name: "Finance & Accounting",
    manager: "Clara Vestergaard",
    members: 6,
    focus: "Budgeting, Payroll, Reporting",
    icon: FiDollarSign,
    status: "Normal",
  },
  {
    id: "T003",
    name: "Marketing & Strategy",
    manager: "Ben O'Reilly",
    members: 9,
    focus: "Digital Campaigns, Branding",
    icon: FiZap,
    status: "Normal",
  },
  {
    id: "T004",
    name: "Logistics & Operations",
    manager: "David Fossen",
    members: 15,
    focus: "Supply Chain, Field Operations",
    icon: FiTruck,
    status: "High Load",
  },
  {
    id: "T005",
    name: "Regional Management",
    manager: "Zahra Hassan",
    members: 7,
    focus: "Regional Leader Coordination",
    icon: FiMapPin,
    status: "Critical",
  },
];

// Helper for load status styling
const getLoadStatusClasses = (status: string) => {
  switch (status) {
    case "Critical":
    case "High Load":
      return "bg-red-100 text-red-700";
    case "Normal":
    default:
      return "bg-green-100 text-green-700";
  }
};

function Teams() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Organizational Teams Directory
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teamsData.map((team) => (
          <div
            key={team.id}
            className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-500 border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 text-3xl text-indigo-600">
                  <team.icon />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {team.name}
                  </h2>
                  <p className="text-sm text-gray-500">Focus: {team.focus}</p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getLoadStatusClasses(
                    team.status
                  )}`}
                >
                  {team.status}
                </span>
                <span className="text-sm text-gray-600">
                  {team.members} Members
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-700">
                <FiUsers className="mr-2 text-blue-500" />
                Manager:{" "}
                <span className="font-medium ml-1">{team.manager}</span>
              </div>
              <a
                href={`/teams/${team.id}`}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
              >
                View Team Page <FiChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;
