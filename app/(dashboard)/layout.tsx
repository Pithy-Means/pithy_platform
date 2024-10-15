'use client';
// import DashboardNavBar from "@/components/dashboard_navBar";

export default function DashboardLayout ({ children }: {children: React.ReactNode }) {
  console.log("DashboardLayout is active");
  return (
    <div className=" ">
      {/* <DashboardNavBar /> */}
      {children}
    </div>
  );
};

