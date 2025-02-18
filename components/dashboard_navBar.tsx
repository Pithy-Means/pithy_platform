import { Search } from "lucide-react";
import Logo from "./Logo";
import { IoMdNotificationsOutline } from "react-icons/io";

interface DashboardNavBarProps {
  user: string | undefined;
  children: React.ReactNode;
}

const DashboardNavBar: React.FC<DashboardNavBarProps> = ({ user, children }) => {

  return (
    <div className="bg-white/90">
      <nav className="flex h-20 w-full bg-white justify-between items-center px-10">
        <div className="text-2xl font-bold text-black">
          <Logo />
        </div>
        <div className="hidden lg:block">
          <div className="hidden relative lg:flex space-x-4 items-center bg-gray-300 border rounded-lg w-full p-2">
            <input
              className="bg-gray-300 outline-none w-full p-2 pl-10 text-black/65"
              placeholder="Search Course"
              id="searchHere"
            />
            <Search color="#7f7676" />
          </div>
        </div>
        <div className="flex items-center gap-x-8 mr-0 lg:mr-10">
          <div>
            <IoMdNotificationsOutline className="text-black h-8 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <div className="bg-black py-1.5 px-3 rounded-full border border-white shadow-md">
              {user}
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default DashboardNavBar;
