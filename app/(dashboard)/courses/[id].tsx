import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  image: string;
  duration: string;
  learners: number;
  originalPrice: string;
  price: string;
  description: string;
}

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
    <div className="flex justify-center">
      <div className="w-1/2">
        {course ? (
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <Image src={course.image}
              alt={course.title}
              className="w-full"
            />
            <p><strong>Duration: </strong>{course.duration}</p>
            <p><strong>Learners: </strong>{course.learners}</p>
            <p><strong>Original Price: </strong>{course.originalPrice}</p>
            <p><strong>Price: </strong>{course.price}</p>
            <p className='mt-4'>{course.description}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default CourseDetails;