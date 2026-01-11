"use client";
import React, { useState } from "react";
import {
  FiUserPlus,
  FiShoppingBag,
  FiMail,
  FiBriefcase,
  FiSend,
  FiPlusCircle,
  FiHash,
  FiTruck,
  FiUsers,
  FiHelpCircle,
  FiChevronRight,
  FiDollarSign,
  FiAlertCircle,
  FiBarChart2,
} from "react-icons/fi";

// --- TYPESCRIPT INTERFACES ---
type FeatherIconComponent = React.ComponentType<any>;

interface Tab {
  id: "create" | "profiles" | "help";
  label: string;
  icon: FeatherIconComponent;
}

interface UserProfile {
  id: number;
  name: string;
  title: string;
  status: "Active" | "Inactive" | "On Leave";
  location: string;
}

interface HelpRequest {
  id: number;
  user: string;
  topic: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Closed";
}

// --- Hardcoded Data ---
const creationTabs: Tab[] = [
  { id: "profiles", label: "User Profiles", icon: FiUsers },
  { id: "create", label: "Create (User & Asset)", icon: FiUserPlus },
  { id: "help", label: "Support Requests", icon: FiHelpCircle },
];

const sampleProfiles: UserProfile[] = [
  {
    id: 1,
    name: "Maria Sanchez",
    title: "Lead Developer",
    status: "Active",
    location: "Lisbon",
  },
  {
    id: 2,
    name: "Ethan Cole",
    title: "Marketing Specialist",
    status: "Active",
    location: "New York",
  },
  {
    id: 4,
    name: "Sarah Connor",
    title: "Technical Support Agent",
    status: "Active",
    location: "Remote",
  },
  {
    id: 5,
    name: "John Titor",
    title: "Customer Support Manager",
    status: "Active",
    location: "Dallas",
  },
  {
    id: 6,
    name: "Kyle Reese",
    title: "IT Helpdesk Specialist",
    status: "Inactive",
    location: "Los Angeles",
  },
  {
    id: 3,
    name: "Jasmine Kaur",
    title: "Data Analyst",
    status: "On Leave",
    location: "Remote",
  },
];

const initialHelpRequests: HelpRequest[] = [
  {
    id: 101,
    user: "Liam O'Connell",
    topic: "VPN Access Failure",
    priority: "High",
    status: "Open",
  },
  {
    id: 102,
    user: "Sophie Dubois",
    topic: "Missing Q4 Report Template",
    priority: "Medium",
    status: "Open",
  },
  {
    id: 103,
    user: "Rajesh Patel",
    topic: "Laptop Replacement Request",
    priority: "Low",
    status: "In Progress",
  },
];

const currentManager = {
  name: "Alexandar Karaadi",
  title: "Chief Operations Manager",
  department: "Executive",
  notifications: 7,
};

// --- Helper Components (Forms, Views, and Cards) ---

const FormInput: React.FC<{
  label: string;
  id: string;
  type: string;
  placeholder: string;
  icon: FeatherIconComponent;
}> = ({ label, id, type, placeholder, icon: Icon }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={type}
        name={id}
        id={id}
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 sm:text-sm border-gray-300 rounded-md p-2.5"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const UserCreationForm: React.FC<{
  onUserRegister: (name: string) => void;
}> = ({ onUserRegister }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userName = formData.get("userName") as string;

    // Simulate API call success
    onUserRegister(userName || "New Employee");
    alert(
      `Successfully registered user: ${
        userName || "New Employee"
      } and created setup ticket!`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-lg shadow-md border border-gray-100 h-full"
    >
      <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
        <FiUserPlus />
        <span>New Employee Registration</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Full Name"
          id="userName"
          type="text"
          placeholder="Alexandar Karaadi"
          icon={FiUserPlus}
        />
        <FormInput
          label="Work Email"
          id="userEmail"
          type="email"
          placeholder="name@company.com"
          icon={FiMail}
        />
        <FormInput
          label="Job Title"
          id="userTitle"
          type="text"
          placeholder="Software Engineer"
          icon={FiBriefcase}
        />
        <FormInput
          label="Department"
          id="userDept"
          type="text"
          placeholder="Engineering"
          icon={FiHash}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="userRole" className="text-sm font-medium text-gray-700">
          Access Role
        </label>
        <select
          id="userRole"
          name="userRole"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
      >
        <FiSend className="h-5 w-5 mr-2" />
        Register User & Send Welcome Email
      </button>
    </form>
  );
};

const ItemCreationForm: React.FC = () => (
  <form className="space-y-6 p-6 bg-white rounded-lg shadow-md border border-gray-100 h-full">
    <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
      <FiShoppingBag />
      <span>New Asset/Marketplace Item Listing</span>
    </h3>
    <div className="space-y-1">
      <label htmlFor="itemType" className="text-sm font-medium text-gray-700">
        Asset Type
      </label>
      <select
        id="itemType"
        name="itemType"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="marketplace">Marketplace Product</option>
        <option value="car">Company Car</option>
        <option value="equipment">Office Equipment</option>
        <option value="other">Other</option>
      </select>
    </div>
    <FormInput
      label="Asset Name/Model"
      id="itemName"
      type="text"
      placeholder="Tesla Model 3 / Premium Office Chair"
      icon={FiTruck}
    />
    <div className="space-y-1">
      <label
        htmlFor="itemDescription"
        className="text-sm font-medium text-gray-700"
      >
        Description
      </label>
      <textarea
        id="itemDescription"
        name="itemDescription"
        rows={3}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5"
        placeholder="Condition, location, and key specifications."
      />
    </div>
    <FormInput
      label="Value/Price ($)"
      id="itemValue"
      type="number"
      placeholder="45000"
      icon={FiDollarSign}
    />
    <button
      type="submit"
      onClick={() => alert("Simulating asset creation success!")}
      className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
    >
      <FiPlusCircle className="h-5 w-5 mr-2" />
      Create Asset Listing
    </button>
  </form>
);

const UserProfilesView: React.FC = () => {
  const supportProfiles = sampleProfiles.filter(
    (profile) =>
      profile.title.toLowerCase().includes("support") ||
      profile.title.toLowerCase().includes("helpdesk")
  );

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2 border-b pb-2">
        <FiUsers />
        <span>
          Support Team Directory ({supportProfiles.length} Users Visible)
        </span>
      </h3>
      {supportProfiles.length === 0 ? (
        <p className="text-gray-500 p-4">
          No support users found in the directory.
        </p>
      ) : (
        supportProfiles.map((profile) => {
          const statusClass =
            profile.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700";
          return (
            <div
              key={profile.id}
              className="flex items-center justify-between p-3 border-b hover:bg-gray-50 transition duration-100"
            >
              <div className="flex items-center space-x-4">
                <div className="text-xl text-indigo-600">
                  <FiUserPlus />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{profile.name}</p>
                  <p className="text-sm text-gray-500">{profile.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${statusClass}`}
                >
                  {profile.status}
                </span>
                <button
                  onClick={() =>
                    alert(`Navigating to profile for ${profile.name}`)
                  }
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                >
                  View Profile
                  <FiChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

const HelpRequestsView: React.FC<{ requests: HelpRequest[] }> = ({
  requests,
}) => (
  <div className="space-y-4 p-6 bg-white rounded-lg shadow-md border border-gray-100">
    <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2 border-b pb-2">
      <FiHelpCircle />
      <span>
        Pending Support Requests (
        {requests.filter((r) => r.status === "Open").length} Open)
      </span>
    </h3>
    {requests.map((request) => {
      let priorityClass;
      if (request.priority === "High")
        priorityClass = "bg-red-100 text-red-700";
      else if (request.priority === "Medium")
        priorityClass = "bg-yellow-100 text-yellow-700";
      else priorityClass = "bg-green-100 text-green-700";

      return (
        <div
          key={request.id}
          className="flex items-center justify-between p-3 border-b hover:bg-gray-50 transition duration-100"
        >
          <div className="flex items-center space-x-4">
            <div className="text-xl text-red-500">
              <FiAlertCircle />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{request.topic}</p>
              <p className="text-sm text-gray-500">
                Requested by: {request.user}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                request.status === "Open"
                  ? priorityClass
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {request.status === "Open" ? request.priority : request.status}
            </span>
            <button
              onClick={() => alert(`Navigating to ticket #${request.id}`)}
              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
            >
              Review
              <FiChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      );
    })}
  </div>
);

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: FeatherIconComponent;
  actionLabel?: string;
  colorClasses: string;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  actionLabel,
  colorClasses,
  onClick,
}) => (
  <div
    className={`flex flex-col justify-between p-6 rounded-xl shadow-lg border-b-4 ${colorClasses} transform transition duration-300 hover:scale-[1.02]`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <Icon className="h-10 w-10 opacity-30" />
    </div>
    {actionLabel && (
      <button
        onClick={onClick}
        className="mt-4 text-xs font-semibold flex items-center group"
      >
        {actionLabel}
        <FiChevronRight className="h-4 w-4 ml-1 transition group-hover:translate-x-1" />
      </button>
    )}
  </div>
);

// --- MODIFIED COMPONENT: Removed totalOpenRequests prop and SupportTicketsCard ---
export const DashboardSummaryView: React.FC<{
  setActiveTab: (tabId: Tab["id"]) => void;
}> = ({ setActiveTab }) => {
  const RegisterUserCard = (
    <DashboardCard
      title="New Employee Onboarding"
      value="Register User"
      icon={FiUserPlus}
      actionLabel="Go to Registration"
      colorClasses="bg-white text-indigo-700 border-indigo-500"
      onClick={() => setActiveTab("create")}
    />
  );

  const NewListingCard = (
    <DashboardCard
      title="Asset Management"
      value="New Listing"
      icon={FiShoppingBag}
      actionLabel="Create New Asset"
      colorClasses="bg-white text-green-700 border-green-500"
      onClick={() => setActiveTab("create")}
    />
  );

  const CurrentManagerCard = (
    <DashboardCard
      title="Current Manager"
      value={currentManager.name.split(" ")[0]}
      icon={FiBriefcase}
      actionLabel={`Notifications: ${currentManager.notifications}`}
      colorClasses="bg-indigo-700 text-white border-indigo-300"
    />
  );

  return (
    // Changed grid layout to 3 columns (lg:grid-cols-3)
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {RegisterUserCard}
      {NewListingCard}
      {CurrentManagerCard}
    </div>
  );
};

// --- Main Component: ManagerDashboard ---
const ManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab["id"]>("profiles");
  const [helpRequests, setHelpRequests] =
    useState<HelpRequest[]>(initialHelpRequests);

  const addHelpRequest = (userName: string) => {
    const newRequest: HelpRequest = {
      id: Date.now(),
      user: userName,
      topic: `New User Onboarding/Setup for ${userName}`,
      priority: "Medium",
      status: "Open",
    };

    setHelpRequests((prevRequests) => [newRequest, ...prevRequests]);
    // Automatically switch to the help tab to show the new ticket visually
    setActiveTab("help");
  };

  // totalOpenRequests is still calculated internally but not needed for the summary view anymore.

  const ActiveIcon =
    creationTabs.find((tab) => tab.id === activeTab)?.icon || FiBarChart2;

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UserCreationForm onUserRegister={addHelpRequest} />
            <ItemCreationForm />
          </div>
        );
      case "profiles":
        return <UserProfilesView />;
      case "help":
        return <HelpRequestsView requests={helpRequests} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex items-center space-x-3 mb-2 text-sm font-semibold uppercase text-indigo-700 tracking-wider">
        <ActiveIcon className="h-5 w-5" />
        <span>Karaadi.com Internal (Manager Portal)</span>
      </div>

      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
        Manager Dashboard
      </h1>

      <div className="max-w-7xl mx-auto">
        {/* Passed setActiveTab only */}
        <DashboardSummaryView setActiveTab={setActiveTab} />

        {/* Tab Navigation */}
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a view
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as Tab["id"])}
          >
            {creationTabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav
            className="flex space-x-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200"
            aria-label="Views"
          >
            {creationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }
                    px-4 py-2 font-medium text-sm rounded-md flex items-center transition duration-150
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Content */}
        <div className="mt-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
