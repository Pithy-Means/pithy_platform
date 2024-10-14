import DashboardNavBar from "@/components/dashboard_navBar";
import localFont from "next/font/local";


const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
    >
      <body>
        <DashboardNavBar />
        {children}

      </body>

    </html>
  )
}

export default DashboardLayout;