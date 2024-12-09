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

const CourseCard: React.FC<CourseCardProps> = ({ courses }) => {
  const router = useRouter();

  const handleViewMore = (course_id: string | number) => {
    if (router) {
      router.push(`/courses/${course_id}`);
    } else {
      console.warn("Route is not available on the server side");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
      {courses.map((course: Courses) => (
        <Link href={`/courses/${course.course_id}`} key={course.course_id}>
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden w-full flex flex-col"
            style={{ minHeight: "350px" }} // Ensures consistent card height
          >
            <Image
              src={course.image}
              alt={course.title}
              width={1200} // Adjust this width to the desired width
              height={500} // Adjust height as needed
              unoptimized
              className="object-cover w-full h-48" // Makes the image fill the full width
            />
            <div className="py-4 px-6 flex flex-col justify-between flex-grow">
              <div className="flex flex-col space-y-1 border-b-slate-300 border-b-4">
                <p className="text-black font-bold text-lg mb-2">
                  {course.title}
                </p>
                <div className="flex items-center justify-between pb-3">
                  <p className="text-gray-600 flex gap-1 items-center">
                    <MdAccessTimeFilled
                      size={20}
                      className="text-orange-600 gap-1"
                    />
                    {course.duration}
                  </p>
                  <p className="text-gray-600 flex gap-2">
                    <FaBookReader size={20} className="text-orange-600" />
                    {course.students} Learners
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="text-green-600 text-base">
                  {course.price} UGX
                </p>
                <button
                  type="button"
                  onClick={() => handleViewMore(course.course_id)}
                  className="text-black/85 font-semibold text-base hover:border rounded-md hover:bg-green-600/100 transition px-2 py-1"
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

export default CourseCard;
