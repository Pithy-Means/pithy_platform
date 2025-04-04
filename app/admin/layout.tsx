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
          <AdminSidebar />
          <main className="flex-1 px-4 bg-gray-50">{children}</main>
        </div>
      </DashboardNavBar>
    </div>
  );
}
