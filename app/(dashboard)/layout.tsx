import DashboardNavBar from "@/components/dashboard_navBar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en"
    >
      <body>
        <DashboardNavBar />
        {children}
      </body>

    </html>
  )
}

export default DashboardLayout;