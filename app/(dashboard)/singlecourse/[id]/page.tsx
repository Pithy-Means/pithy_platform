'use client';
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { getSingleCourse } from '@/app/(api)/api/courses/route'
import course from '@/types/Course'
import { useParams } from 'next/navigation'
import OverView from '@/components/OverView';
import CourseSidebar from '@/components/CourseSidebar';
import OtherCourses from '@/components/OtherCourses';


const SingleCourse: React.FC = () => {
  const { id } = useParams() as { id: string };
  const [course, setCourse] = useState<course | undefined>(undefined);
  const [showSummary, setShowSummary] = useState(false);
  const [showResources, setShowResources] = useState(false);
  // State to track the active module
  const [activeModule, setActiveModule] = useState<string>('');

  useEffect(() => {
    const fetchCourse = async () => {
      if (id) {
        try {
          const fetchedCourse = await getSingleCourse(id as string);
          setCourse(fetchedCourse);
        } catch (error) {
          console.error('Error fetching course:', error);
        }
      }
    };
    fetchCourse();
  }, [id]);

  if (!course) {
    return <p>Course not found</p>;
  }

  if (!id) {
    return <p>Course ID not found</p>;
  }

  //course sidebar modules
  const modules = [
    { title: 'Course Overview', isLocked: false },
    { title: 'Fundamental Entrepreneurial Skills', isLocked: false },
    { title: 'Bringing The Change That’s Needed', isLocked: true },
    { title: 'Kampala Case Study Exploration', isLocked: true },
    { title: 'Applying The Concepts And Over Success', isLocked: true },
    { title: 'Conclusion On Take Of The Expertise', isLocked: true },
  ];

  const mockCourses = [
    {
      id: 1,
      title: 'Psychological Assessment In A Unhealthy Working Environment',
      duration: '3 Hours',
      modules: 3,
      image: '/assets/course1.png',
    },
    {
      id: 2,
      title: 'Psychological Assessment In A Unhealthy Working Environment',
      duration: '3 Hours',
      modules: 3,
      image: '/assets/course1.png',
    },
    {
      id: 3,
      title: 'Psychological Assessment In A Unhealthy Working Environment',
      duration: '3 Hours',
      modules: 3,
      image: '/assets/course1.png',
    },
  ];

  const progress = 3;

  return (
    <div className='flex flex-row bg-gray-300 '>
      <div className=''>
        <OverView />
      </div>
      <div className='flex flex-col m-10 bg-white p-4 text-black'>
        <div>
          <Image src={course.image}
            alt={course.title}
            width={500}
            height={300}
            className='object-cover rounded-none w-full h-80'
          />
        </div>
        <div className='flex '>
          <div>
            <p
              style={{ cursor: 'pointer', fontWeight: showSummary ? 'bold' : 'normal' }}
              onClick={() => setShowSummary(prev => !prev)}
            >
              Summary
            </p>
            {showSummary && (
              <div>
                <p className='px-10 py-2'>{course.description}</p>
              </div>
            )}
          </div>

          <div className='flex flex-col '>
            <p className='py-2 px-4'
              style={{ cursor: 'pointer', fontWeight: showResources ? 'bold' : 'normal' }}
              onClick={() => setShowResources(prev => !prev)}
            >
              Resources
            </p>
            {showResources && (
              <div>
                <p>Resouce1</p>
                <p>Resouce2</p>
                <p>Resouce3</p>
                <p>Resouce4</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <CourseSidebar
          modules={modules}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          progress={progress}
        />
        <OtherCourses  courses={mockCourses}/>
      </div>
    </div>
  );

};

export default SingleCourse