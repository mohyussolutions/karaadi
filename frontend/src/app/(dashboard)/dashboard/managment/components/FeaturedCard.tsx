"use client";

import Link from "next/link";
import { FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";

interface FeaturedCardProps {
  item: {
    id: string;
    name: string;
    path: string;
    icon: any;
    description: string;
    featured?: boolean;
  };
}

const FeaturedCard = ({ item }: FeaturedCardProps) => {
  const Icon = item.icon;

  return (
    <Link
      href={item.path}
      className="group border border-gray-200 bg-white rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
          <Icon className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
        </div>
        <FaExternalLinkAlt className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>

      <p className="text-sm text-gray-600 mb-4">{item.description}</p>

      <div className="flex items-center justify-between mt-4">
        <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
          Featured
        </span>
        <span className="text-sm text-gray-500 group-hover:text-gray-700 flex items-center gap-1">
          Open <FaChevronRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
};

export default FeaturedCard;
