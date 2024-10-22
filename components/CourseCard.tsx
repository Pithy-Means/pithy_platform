'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { MdAccessTimeFilled } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import Link from 'next/link';
import Course from '@/types/Course';
import { useRouter } from 'next/navigation';

interface CourseCardProps {
  courses: Course[];
}

// const CourseCard = ({ courses }: CourseCardProps) => {}; //another way to define a functional component with props
const CourseCard: React.FC<CourseCardProps> = ({ courses }) => {
  const router = useRouter();
  // const [courses, setCourses] = useState<Course[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  
  const handleViewMore = (_id: string | number) => {
    //check if router is available before navigating
    if (isClient ) {
      // Navigate to the course details page using the course id
      router.push(`/singlecourse/${_id}`);

    } else {
      console.warn('Route is not available on the server side');
    }
  };


  return (
    <div className='max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-8 p-6'>
      {courses.map((course: Course) => (
        <Link href={`/singlecourse/${course._id}`} key={course._id}>
          <div key={course._id} className='bg-white shadow-lg rounded-lg overflow-hidden '>
            <Image src={course.image}
              alt={course.title}
              width={300}
              height={200}
              className='object-cover rounded-t-sm w-full h-60'
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
                  type='button'
                  onClick={() => handleViewMore(course._id)}
                  className='text-black/85 font-bold text-base hover:border rounded-md  hover:bg-green-600/100 transition px-1 '
                >
                  View more
                </button>

              </div>
            </div>
          </div>
        </Link>



      ))}

    </div>
  );
};


export default CourseCard