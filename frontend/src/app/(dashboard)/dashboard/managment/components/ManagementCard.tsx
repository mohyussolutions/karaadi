"use client";

import Link from "next/link";

interface ManagementCardProps {
  item: {
    id: string;
    name: string;
    path: string;
    icon: any;
    description: string;
    featured?: boolean;
  };
}

const ManagementCard = ({ item }: ManagementCardProps) => {
  const Icon = item.icon;

  return (
    <Link
      href={item.path}
      className="group border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
          <Icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
              {item.name}
            </h3>
            {item.featured && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Featured
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">{item.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ManagementCard;
