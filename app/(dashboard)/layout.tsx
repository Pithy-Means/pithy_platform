'use client';

import DashboardNavBar from "@/components/dashboard_navBar";

export default function DashboardLayout ({ children }: {children: React.ReactNode }) {
 
  return (
    <div className=" ">
      <DashboardNavBar>
        {children}
      </DashboardNavBar>
    </div>
  );
};

