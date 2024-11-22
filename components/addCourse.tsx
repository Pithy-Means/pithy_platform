// Code to add a course to the database
interface Course {
  title: string;
  image: string;
  duration: string;
  learners: number;
  originalPrice: string;
  price: string;
}

const addCourse = async (newCourse: Course) => {
  try {
    const response = await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCourse),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while adding the course");
    }
    const saveCourse = await response.json();
    console.log("New course added:", saveCourse);
  } catch (error) {
    console.error("Error adding course:", error);
  }
};

export default addCourse;

//example usage
// const handleAddCourse = () => {
//   const courseData = {
//     title: 'Introduction to Python Programming',
//     image: '/assets/development3.png',
//     duration: '2hr - 30min',
//     learners: 150,
//     originalPrice: 'UGX100,000',
//     price: 'Free',
//   };
//   addCourse(courseData);
// }
