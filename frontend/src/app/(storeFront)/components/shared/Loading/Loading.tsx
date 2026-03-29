import React from "react";

function Loading() {
  return (
    <div className="w-full flex justify-center items-center py-8">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );
}

export default Loading;
