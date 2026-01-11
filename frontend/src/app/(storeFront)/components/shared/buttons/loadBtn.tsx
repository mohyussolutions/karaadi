import React, { useState } from "react";

type LoadBtnProps = {
  onClick: () => void;
  expanded: boolean;
};

function LoadBtn({ onClick, expanded }: LoadBtnProps) {
  const [isLoading, setIsLoading] = useState(false);

  const toggleReadMore = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    onClick();
  };

  return (
    <div>
      <button
        onClick={toggleReadMore}
        disabled={isLoading}
        className={`bg-blue-600 text-white px-4 py-2 rounded-[10px] hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2 min-w-[120px] ${
          isLoading ? "opacity-75 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? (
          <>
            {expanded ? "Showing Less" : "Loading More"}
            <svg
              className="animate-spin h-5 w-5 text-white ml-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </>
        ) : expanded ? (
          "Show Less"
        ) : (
          "Read More"
        )}
      </button>
    </div>
  );
}

export default LoadBtn;
