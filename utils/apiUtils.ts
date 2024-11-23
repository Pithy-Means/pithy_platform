import course from "@/types/Course";

export const getData = async () => {
    const res = await fetch('/api/courses');
    if (!res.ok) {
      throw new Error('Something went wrong while fetching the data');
    }
    const data = await res.json();
    return data;
  };
  
  export const getSingleCourse = async (_id: number | string): Promise<course | undefined> => {
    const items = await getData();
    const singleCourse = items.find((course: course) => course._id === _id);
    return singleCourse;
  };