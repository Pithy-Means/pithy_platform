import AdminSidebar from "@/components/AdminSidebar";
import DashboardNavBar from "@/components/dashboard_navBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardContent>{children}</DashboardContent>;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <DashboardNavBar>
        <div className="flex mt-4 space-x-4">
          <AdminSidebar>
            {children}
          </AdminSidebar>
        </div>
      </DashboardNavBar>
    </div>
  );
}
