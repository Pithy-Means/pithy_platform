'use client'
import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import { getSingleCourse } from '@/app/(api)/api/courses/route'
import course from '@/types/Course'

type Props = {
  searchParams: {
  [key: string]: string | string[] | undefined;
}
};

const SingleCourse: React.FC<Props> = ({searchParams}) => {
  const _idString = searchParams._id as string | undefined;
  const [course, setCourse] = useState<course | undefined>(undefined);

  useEffect(() => {
    const fetchCourse = async () => {
      if (_idString) {
        const _id = Number(_idString);
        const fetchedCourse = await getSingleCourse(_id);
        setCourse(fetchedCourse);
      }
    };
    fetchCourse();
  }, [_idString]);

  if (!course) {
    return <p>Course not found</p>;
  }

  if (!_idString) {
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