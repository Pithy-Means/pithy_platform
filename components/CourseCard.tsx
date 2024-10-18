'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { MdAccessTimeFilled } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import { useRouter } from 'next/navigation';


interface Course {
  id: string;
  title: string;
  image: string;
  duration: string;
  learners: number;
  originalPrice: string;
  price: string;
}

interface CourseCardProps {
  courses: Course[];
}

const CourseCard: React.FC<CourseCardProps> = ({ courses}) => {
  // const [courses, setCourses] = useState<Course[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  // const router = typeof window !== 'undefined' ? useRouter() : null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // const router = useRouter();
  const handleViewMore = (id: string) => {
    router.push(`/courses/${id}`);
  };
  // const handleViewMore = (id: string) => {
  //   //check if router is available before navigating
  //   if (isClient) {
  //     // Navigate to the course details page using the course id
  //     router.push(`/courses/${id}`);

  //   } else {
  //     console.warn('Router is not available on the server side');
  //   }
  // };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6'>
      {courses.map((course: Course, index: number) => (
        <div key={index} className='bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105'>
          <Image src={course.image}
            alt={course.title}
            width={300}
            height={200}
            className='object-cover rounded-t-sm w-full'
          />
          <div className='p-4'>
            <p className='text-black font-bold text-lg mb-2'>{course.title}</p>
            <div className='flex flex-row gap-4 mb-4'>
              <p className='text-gray-600 flex gap-1 items-center'>
                <MdAccessTimeFilled size={20} className='text-orange-600 gap-1' />
                {course.duration}
              </p>
              <p className='text-gray-600 flex gap-2'>
                <FaBookReader size={20} className='text-orange-600 ' />
                {course.learners} Learners
              </p>
            </div>
            <div className='flex flex-row justify-between items-center p-2'>
              <p className=' text-green-600 text-base'>
                <del className='text-gray-400 pr-2 items-center flex flex-row'>{course.originalPrice}</del>
                Free
              </p>
              <button 
              onClick={() => handleViewMore(course.id)}
              type='button'
              // onClick={() => router.push('/courses/' + course.id)}
              className='text-black/85 font-bold text-lg hover:border rounded-md  hover:bg-green-600/100 transition px-1'
              >
                View more
              </button>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
};


  export default CourseCard