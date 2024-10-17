import React from 'react'
import { AiFillHome } from "react-icons/ai";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { IoIosPeople } from "react-icons/io";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";

const OverView = () => {
  return (
    <div className='flex flex-col bg-white w-1/4 text-black px-6 justify-center  mt-6'>
      <div className=''>
        <div>
          <p className='text-lg py-4'>Overview</p>
          <div className='space-y-4 mb-10'>

            <div className='flex flex-row gap-1 items-center'>
              <AiFillHome size={24} />
              <p className='text-base'>Home</p>
            </div>
            <div className='flex flex-row gap-1 items-center'>
              <HiMiniClipboardDocumentList size={24} />
              <p className='text-base'>courses</p>
            </div>
            <div className='flex flex-row gap-1 items-center'>
              <IoIosPeople size={24} />
              <p className='text-base'>Community</p>
            </div>
            <div className='flex flex-row gap-1 items-center'>
              <MdOutlineAddCircle size={24} />
              <p className='text-base'>Post</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div>
          <div>
            <p className='text-lg py-4'>Account</p>
          </div>
          <div className='space-y-4 mb-10'>
            <div className='flex flex-row gap-1 items-center'>
              <IoPersonOutline size={24} />
              <p className='text-base'>Profile & settings</p>
            </div>
            <div className='flex flex-row gap-1 items-center'>
              <IoNotifications size={24} />
              <p className='text-base'>Notifications</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <p className='text-lg py-2'>other features</p>
        </div>
        <div className='space-y-4 mb-2'>
          <div className='flex flex-row gap-1 items-center'>
            <IoMdHelpCircleOutline size={24}/>
            <p className='text-base'>Help & support</p>
          </div>
          <div className='flex flex-row gap-1 items-center'>
            <IoMdLogOut size={24}/>
            <p className='text-base'>Logout</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default OverView