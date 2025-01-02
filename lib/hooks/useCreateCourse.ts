import { Courses } from "@/types/schema";
import { useFetch } from "./useFetch";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export const useCreateCourse = () => {
  const { data, error, loading, fetchData } = useFetch();
  const { user } = useContext(UserContext);

  const handleSubmit = async (course: Courses) => {
    if (!user?.user_id) {
      throw new Error("User not logged in");
    }

    const newCourse = {
      ...course,
      user_id: user?.user_id,
    };

    const result = await fetchData('/api/create-course', 'POST', { 'Content-Type': 'application/json' } ,newCourse);

    if (result) {
      console.log('Course created:', result);
    } else {
      console.error('Failed to create course.');
    }

    return result;
  };

  return { handleSubmit, data, error, loading };
};