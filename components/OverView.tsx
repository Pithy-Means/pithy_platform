import React from "react";
import { GoHome } from "react-icons/go";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { IoIosPeople } from "react-icons/io";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";

const OverView = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <div className="flex flex-col bg-white text-black px-6 justify-center rounded mt-6 shadow-lg shadow-black w-1/4 ">
        <div className="">
          <div>
            <p className="text-lg py-4">Overview</p>
            <div className="space-y-4 mb-10">
              <div className="flex flex-row gap-3">
                <GoHome size={24} />
                <p className="text-base">Home</p>
              </div>
              <div className="flex flex-row gap-3 items-center">
                <HiMiniClipboardDocumentList size={24} />
                <p className="text-base">courses</p>
              </div>
              <div className="flex flex-row gap-3 items-center">
                <IoIosPeople size={24} />
                <p className="text-base">Community</p>
              </div>
              <div className="flex flex-row gap-3 items-center">
                <MdOutlineAddCircle size={24} />
                <p className="text-base">Post</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <>
            <div>
              <p className="text-lg py-4">Account</p>
            </div>
            <div className="space-y-4 mb-10">
              <div className="flex flex-row gap-3 items-center">
                <IoPersonOutline size={24} />
                <p className="text-base">Profile & settings</p>
              </div>
              <div className="flex flex-row gap-3 items-center">
                <IoNotifications size={24} />
                <p className="text-base">Notifications</p>
              </div>
            </div>
          </>
        </div>
        <div>
          <div>
            <p className="text-lg py-2">other features</p>
          </div>
          <div className="space-y-4 mb-2">
            <div className="flex flex-row gap-3 items-center">
              <IoMdHelpCircleOutline size={24} />
              <p className="text-base">Help & support</p>
            </div>
            <div className="flex flex-row gap-3 items-center text-[#F26900]">
              <IoMdLogOut size={24} />
              <p className="text-base">Logout</p>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default OverView;
