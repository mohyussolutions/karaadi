import React from "react";

interface ContainerLinksProps {
  children: React.ReactNode;
}

function ContainerLinks({ children }: ContainerLinksProps) {
  return (
    <div className="max-w-screen-xl mx-auto w-full px-1 sm:px-4">
      {children}
    </div>
  );
}

export default ContainerLinks;
