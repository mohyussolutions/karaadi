import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`
    mx-auto
    w-full
    max-w-[64.5rem]
    px-4 md:px-6  
    ${className}
  `}
    >
      {" "}
      <main className={`bg-white min-h-screen flex-1 ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default Container;
