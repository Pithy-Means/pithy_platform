'use client'
import React, { useState, useEffect } from 'react'
import { FaListUl } from "react-icons/fa";
import { LiaThListSolid } from "react-icons/lia";
import CourseCard from './CourseCard';


const CourseView: React.FC = () => {
  const [courses, setCourses] = useState([]);
  // const [courses, setCourses] = useState(dummyCourses);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Something went wrong while fetching the data');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Error fetching courses');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return <p>Loading courses ...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }


  return (
    <div className='flex flex-col w-full h-full '>
      <div className='flex flex-col bg-white  text-black px-6 justify-center h-10 p-4 m-6'>
        <div className='flex justify-between'>
          <div>
            <p className='text-lg'>All Courses</p>
          </div>
          <div className='flex flex-row gap-10 items-center'>
            <div>
              <LiaThListSolid size={30} className='text-green-600 text-fill' />
            </div>
            <div >
              <FaListUl size={20} className='' />
            </div>
          </div>
        </div>
      </div>

      <CourseCard courses={courses} />
    </div>
  )
}

export default CourseView