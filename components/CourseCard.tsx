"use client";

import Image from "next/image";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Courses } from "@/types/schema";

interface CourseCardProps {
  courses: Courses[];
}

// const CourseCard = ({ courses }: CourseCardProps) => {}; //another way to define a functional component with props
const CourseCard: React.FC<CourseCardProps> = ({ courses }) => {
  const router = useRouter();

  const handleViewMore = (course_id: string | number) => {
    //check if router is available before navigating
    if (router) {
      // Navigate to the course details page using the course id
      router.push(`/singlecourse/${course_id}`);
    } else {
      console.warn("Route is not available on the server side");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-8 p-6 ">
      {courses.map((course: Courses) => (
        <Link href={`/singlecourse/${course.course_id}`} key={course.course_id}>
          <div
            key={course.course_id}
            className="bg-white shadow-lg rounded-lg overflow-hidden w-full"
          >
            <Image
              src={course.image}
              alt={course.title}
              width={500}
              height={500}
              unoptimized
              className="object-contain rounded-t-sm w-full "
            />
            <div className="p-4">
              <p className="text-black font-bold text-lg mb-2">
                {course.title}
              </p>
              <div className="flex flex-row gap-4 mb-4">
                <p className="text-gray-600 flex gap-1 items-center">
                  <MdAccessTimeFilled
                    size={20}
                    className="text-orange-600 gap-1"
                  />
                  {course.duration}
                </p>
                <p className="text-gray-600 flex gap-2">
                  <FaBookReader size={20} className="text-orange-600 " />
                  {course.students} Learners
                </p>
              </div>
              <div className="flex flex-row justify-between items-center p-2">
                <p className=" text-green-600 text-base">
                  <del className="text-gray-400 pr-2 items-center flex flex-row">
                    {course.price}
                  </del>
                  Free
                </p>

                <button
                  type="button"
                  onClick={() => handleViewMore(course.course_id)}
                  className="text-black/85 font-semibold text-base hover:border rounded-md  hover:bg-green-600/100 transition px-1 text-center "
                >
                  View more
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
      ;
    </div>
  );
};

export default CourseCard;
