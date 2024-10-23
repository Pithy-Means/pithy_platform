import React from 'react'
import { FaLock, FaLockOpen } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";


interface Module {
  title: string;
  isLocked: boolean;
};

interface CourseSidebarProps {
  modules: Module[];
  activeModule: string;
  setActiveModule: (module: string) => void;
  progress: number;
};

const CourseSidebar: React.FC<CourseSidebarProps> = ({ modules, activeModule, setActiveModule, progress }) => {
  return (
    <div className='bg-white w-72 p-4 shadow-md rounded-md'>
      <div className='mb-6'>
        <h2 className='text-lg font-bold mb-2'>
          Entrepreneurship In East Africa - Case Study UG
        </h2>
        <div className='text-sm text-gray-600 mb-2'>{progress}% Completed</div>
        <div className='relative w-full h-3 bg-gray-200 rounded-full'>
          <div className='absolute top-0 left-0 h-3 bg-green-500 rounded-full'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className='mt-6'>
        <h3 className='text-md font-semibold mb-3'>Modules</h3>
        <ul className='space-y-3'>
          {modules.map((module, index) => (
            <li key={index}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer 
              ${activeModule === module.title ? 'bg-green-100 font-bold' : ''
                } ${module.isLocked ? 'text-gray-500' : 'text-black'}`}
              onClick={() => !module.isLocked && setActiveModule(module.title)}
            >
              <span className='flex items-center'>
                <span className='mr-2'>
                  {module.isLocked ? (
                    <span><FaLock size={20} /></span>
                  ) : (
                    <span><FaLongArrowAltRight /></span>
                  )}
                </span>
                {module.title}
              </span>
              {!module.isLocked && <span><FaLockOpen size={20} /></span>}
            </li>
          ))}
        </ul>
      </div>
    </div >
  );
};

export default CourseSidebar