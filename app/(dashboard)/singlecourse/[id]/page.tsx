'use client';
import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import { getSingleCourse } from '@/app/(api)/api/courses/route'
import course from '@/types/Course'
import { useParams } from 'next/navigation'


const SingleCourse: React.FC = () => {
  const { id } = useParams() as { id: string };
  const [course, setCourse] = useState<course | undefined>(undefined);

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

  return (
    <div>
      <div>
        <Image src={course.image}
          alt={course.title}
          width={500}
          height={300}
        />
      </div>
      <div>
        <div>
          <p>Summary</p>
          <p>{course.description}</p>
        </div>
        <p>Resources</p>
        <div>
          <p>Resouce1</p>
          <p>Resouce2</p>
          <p>Resouce3</p>
          <p>Resouce4</p>
        </div>
      </div>

    </div>
  );

};
export default SingleCourse