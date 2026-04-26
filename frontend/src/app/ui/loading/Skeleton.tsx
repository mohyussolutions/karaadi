import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 24,
  count = 1,
  className = "",
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 rounded ${className}`}
          style={{ width, height, marginBottom: 6 }}
        />
      ))}
    </>
  );
};

export default Skeleton;
