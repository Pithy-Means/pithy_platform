import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Course from "@/types/Course";


const CourseDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Get the course id from the URL
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    // Fetch the course details using the id
    if (id) {
      fetch(`/api/courses/${id}`)
        .then((res) => res.json())
        .then((data) => setCourse(data.course));
    }
  }, [id]);

  if (!id) {
    return <p>Loading...</p>;
  }

  if (!course) {
    return <p>Course not found</p>;
  }

  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex flex-col  text-black/75 px-6 justify-center h-10 p-4 m-6'>
        {/* <div className='flex flex-col justify-between'> */}
          <div className='flex flex-col'>
            <p className='text-2xl text-black-95 font-bold'>Introduction</p>
            <p className='text-black/50 text-base'>Module 1 - Course overview</p>
          </div>
          <div>
            <div className="w-1/2">
              {course ? (
                <div>
                  <Image src={course.image}
                    width={500}
                    height={300}
                    alt={course.title}
                    className="w-full object-cover h-96 rounded-md "
                  />
                  <div className="flex flex-row gap-4 p-2 text-black">
                    <p className="text-base font-semibold hover:outline-2 hover:border-gray-600 transition">Summary</p>
                    <p className="text-base">Resources</p>
                    <div >
                      {course.description}
                    </div>
                  </div>

                  <p className='mt-4'>{course.description}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>

          </div>

        
      </div>
    </div>
  );
}

export default CourseDetails;