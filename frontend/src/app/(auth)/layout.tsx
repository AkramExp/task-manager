import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full flex items-center justify-center h-screen">
      {children}
    </div>
  );
};

export default layout;
