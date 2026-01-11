"use client";

export default function ManagerLoading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="animate-spin h-12 w-12 border-4 border-gray-500 border-t-transparent rounded-full"></div>
    </div>
  );
}
