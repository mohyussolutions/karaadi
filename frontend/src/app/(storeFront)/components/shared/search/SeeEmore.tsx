import React from "react";

interface SeeEmoreProps {
  onClick: () => void;
}

function SeeEmore({ onClick }: SeeEmoreProps) {
  return (
    <div className="flex justify-center my-8">
      <button
        onClick={onClick}
        className="
          px-12 py-3 
          bg-gradient-to-r from-blue-500 to-indigo-600 
          text-white text-lg font-semibold 
          rounded-full shadow-lg 
          hover:from-indigo-600 hover:to-blue-500 
          transform hover:scale-[1.03] transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-blue-300
        "
      >
        See More
      </button>
    </div>
  );
}

export default SeeEmore;
