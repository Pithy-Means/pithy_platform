import { NextResponse } from "next/server";
import course from "@/types/Course";
import Course from "@/types/Course";

// Dummy data for testing
const courses: Course[] = [
  {
    _id: "1",
    title: "Entrepreneurship in East Africa - Case study UG",
    image: "/assets/development1.png",
    duration: "1hr - 13min",
    learners: 93,

    originalPrice: 'UGX80,000',
    price: 'Free',
    description: 'This course is designed to help you understand the basics of entrepreneurship in East Africa, with a focus on Uganda. It covers the key concepts, challenges, and opportunities for entrepreneurs in the region.',
    content: "",
    authorId: "",
    name: "",
    email: "",
    password: "",
    role: "",
    courses: [],
    postId: ""
  },
  {
    _id: "2",
    title: "Introduction to Web Development",
    image: "/assets/development2.png",
    duration: "2hr - 30min",
    learners: 150,
    originalPrice: 'UGX100,000',
    price: 'Free',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore reiciendis nostrum aut blanditiis possimus. Voluptatibus, doloribus quo nisi quisquam, voluptatem ut suscipit porro ipsam saepe optio fuga nobis consectetur Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore reiciendis nostrum aut blanditiis possimus. Voluptatibus, doloribus quo nisi quisquam, voluptatem ut suscipit porro ipsam saepe optio fuga nobis consecteturLorem ipsum dolor sit amet consectetur, adipisicing elit. Labore reiciendis nostrum aut blanditiis possimus. Voluptatibus, doloribus quo nisi quisquam, voluptatem ut suscipit porro ipsam saepe optio fuga nobis consecteturLorem ipsum dolor sit amet consectetur, adipisicing elit. Labore reiciendis nostrum aut blanditiis possimus Voluptatibus, doloribus quo nisi quisquam, voluptatem ut suscipit porro ipsam saepe optio fuga nobis consecteturLorem ipsum dolor sit amet consectetur, adipisicing elit. Labore reiciendis nostrum aut blanditiis possimus. Voluptatibus, doloribus quo nisi quisquam, voluptatem ut suscipit porro ipsam saepe optio fuga nobis consecteturLorem ipsum dolor sit amet consectetur, adipisicing elit. Labore reiciendis nostrum aut blanditiis possimus Voluptatibus, doloribus quo nisi quisquam, voluptatem ut suscipit porro ipsam saepe optio fuga nobis consecteturLorem ipsum dolor sit amet consectetur, adipisicing elit. Labore reiciendis nostrum aut blanditiis possimus.',
    content: "",
    authorId: "",
    name: "",
    email: "",
    password: "",
    role: "",
    courses: [],
    postId: ""
  },
  {
    _id: "3",
    title: "Introduction to Web Development",
    image: "/assets/development2.png",
    duration: "2hr - 30min",
    learners: 150,
    originalPrice: 'UGX100,000',
    price: '80,000',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore reiciendis nostrum aut blanditiis possimus. Voluptatibus, doloribus quo nisi quisquam, voluptatem ut suscipit porro ipsam saepe optio fuga nobis consectetur Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore reiciendis nostrum aut blanditiis possimus. Voluptatibus, consectetur, adipisicing elit. Labore reiciendis nostrum aut blanditiis possimus.',
    content: "",
    authorId: "",
    name: "",
    email: "",
    password: "",
    role: "",
    courses: [],
    postId: ""
  },
];

// Route to fetch courses
export async function GET() {
  try {
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const getData = async (): Promise<Course[]> => {
  const res = await fetch('/api/courses');
  if (!res.ok) {
    throw new Error("Something went wrong while fetching the data");
  }
  const data: Course[] = await res.json();
  return data;
};

export const getSingleCourse = async (
  _id: number | string,
): Promise<course | undefined> => {
  const items = await getData();
  const singleCourse = items.find((course: course) => course._id === _id);
  return singleCourse;
};
