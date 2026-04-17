"use client";

import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return (
    <div className="bg-[#FEFDFD] min-h-screen w-full flex flex-col">
      <main
        className={`
          mx-auto
          w-full
          max-w-[64.5rem]
          px-4 
          md:px-6
          flex-grow
          ${className}
        `}
      >
        {children}
      </main>
    </div>
  );
};

export default Container;
