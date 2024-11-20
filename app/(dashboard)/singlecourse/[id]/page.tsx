'use client';
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { getSingleCourse } from '@/utils/apiUtils';
import course from '@/types/Course'
import { useParams } from 'next/navigation'
import OverView from '@/components/OverView';
import CourseSidebar from '@/components/CourseSidebar';
import OtherCourses from '@/components/OtherCourses';

type Module = {
  title: string;
  isLocked: boolean;
  content: string;
};

const SingleCourse: React.FC = () => {
  const { id } = useParams() as { id: string };
  const [course, setCourse] = useState<course | undefined>(undefined);
  const [showSummary, setShowSummary] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [loading, setLoading] = useState(false);
  // State to track the active module
  const [activeModule, setActiveModule] = useState<string>('');
  const [modules, setModules] = useState<Module[]>([
    {
      title: 'Fundamental Entrepreneurial Skills',
      isLocked: true,
      content: 'This is the first module',
    },
    {
      title: 'Bringing The Change That’s Needed',
      isLocked: true,
      content: 'To implement the functionality where clicking on a locked module in the sidebar unlocks it and then displays its details in the main content area, you need to:Track the state of locked/unlocked modules.',
    },
    {
      title: 'Kampala Case Study Exploration',
      isLocked: true,
      content: 'This is the second module',
    },
    {
      title: 'Applying The Concepts And Over Success',
      isLocked: true,
      content: 'This is the third module',
    },
    {
      title: 'Conclusion On Take Of The Expertise',
      isLocked: true,
      content: 'This is the fourth module',
    },

  ]);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      if (id) {
        try {
          const fetchedCourse = await getSingleCourse(id as string);
          setCourse(fetchedCourse);
          setShowSummary(true);
          setShowResources(false);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching course:', error);
        }
      }
    };
    fetchCourse();
  }, [id]);

  if (!course) {
    return <p
      className='flex justify-center items-center font-bold text-4xl py-32 bg-white object-cover text-black h-screen'
    >
      Course not found
    </p>;
  }

  if (!id) {

    // return <p
    //   className='flex justify-center items-center font-bold text-4xl py-32 bg-white object-cover text-black h-screen'
    // >
    //   Course ID not found
    // </p>;
    setLoading(true);
  }

  if (loading) {
    return <p
      className='flex justify-center items-center font-bold text-4xl py-20 bg-white object-cover text-black h-screen'
    >
      Loading...
    </p>;

  }

  const handleToggleSummary = () => {
    setShowSummary(true);
    setShowResources(false);
  };

  const handleToggleResources = () => {
    setShowSummary(false);
    setShowResources(true);
  };

  const mockCourses = [
    {
      id: 1,
      title: 'Psychological Assessment In A Unhealthy Working Environment',
      duration: '3 Hours',
      modules: 3,
      image: '/assets/development1.png',
    },
    {
      id: 2,
      title: 'Psychological Assessment In A Unhealthy Working Environment',
      duration: '3 Hours',
      modules: 3,
      image: '/assets/development1.png',
    },
    {
      id: 3,
      title: 'Psychological Assessment In A Unhealthy Working Environment',
      duration: '3 Hours',
      modules: 3,
      image: '/assets/development1.png',
    },
  ];

  // const progress = 3;
  const progress = () => {
    const unlockedModules = modules.filter((module) => !module.isLocked);
    const progressPercentage = (unlockedModules.length / modules.length) * 100;
    return progressPercentage;
  }


  // const handleUnlockModule = (moduleTitle: string) => {
  //   setModules((prevModules) => {
  //     return prevModules.map((module) => {
  //       if (module.title === moduleTitle) {
  //         return { ...module, isLocked: false };
  //       }
  //       return module;
  //     });
  //     setActiveModule(moduleTitle);
  //   }
  //   );
  // }

  const handleUnlockModule = (moduleTitle: string) => {
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.title === moduleTitle
          ? { ...module, isLocked: false }
          : module
      )
    );
    setActiveModule(moduleTitle);
  }

  const currentModuleContent = modules.find((module) => module.title === activeModule)?.content;

  return (
    <div className='flex flex-row bg-gray-300 pr-6 w-full'>

      <OverView>

        <div className='flex flex-col space-y-4 p-4 text-black w-full'>
          <div className=''>
            <h1 className='text-2xl font-semibold mb-2'>
              {activeModule ? currentModuleContent : 'Introduction'}
            </h1>
            {activeModule ? (
              <div>
                <p className='text-gray-500 mb-2'>{activeModule.title}</p>
              </div>
            ) : (
              <>
                <p className='text-gray-500 mb-2'>{modules[0].title}</p>
                <div>
                  <Image src={course.image}
                    alt={course.title}
                    width={500}
                    height={300}
                    className='object-cover rounded-none w-full h-80'
                  />
                </div>
              </>
            )}

            <div className='flex flex-col'>
              <div className='flex items-center space-x-4'>
                <div>
                  <p
                    style={{ cursor: 'pointer', fontWeight: showSummary ? 'bold' : 'normal' }}
                    onClick={handleToggleSummary}
                  >
                    Summary
                  </p>
                </div>

                <div className='flex flex-col '>
                  <p className='px-4'
                    style={{ cursor: 'pointer', fontWeight: showResources ? 'bold' : 'normal' }}
                    onClick={handleToggleResources}
                  >
                    Resources
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                {showSummary && (
                  <div>
                    <p className='text-base '>{course.description}</p>
                  </div>
                )}
                {showResources && (
                  <div className='text-base xl:text-lg px-4 py-6 space-y-2'>
                    <p>{course.title}</p>
                    <p>{course.title}</p>
                    <p>Resource 3</p>
                    <p>module title</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
        <div>
          <CourseSidebar
            modules={modules}
            activeModule={activeModule}
            setActiveModule={(moduleTitle) => {
              const selectedModule = modules.find((m: Module) => m.title === moduleTitle);
              if (selectedModule && selectedModule.isLocked) {
                handleUnlockModule(moduleTitle);
              } else {
                setActiveModule(moduleTitle);
              }
            }}
            progress={progress()}
            unlockModule={handleUnlockModule}
          />
          <OtherCourses courses={mockCourses} />
        </div>
      </OverView>
    </div>
  );

};

export default SingleCourse