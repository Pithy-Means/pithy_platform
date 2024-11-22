"use client";
import { useState } from "react";
import addCourse from "../../../../components/addCourse";

interface Course {
  title: string;
  image: string;
  duration: string;
  learners: number;
  originalPrice: string;
  price: string;
}

const CourseAdmin: React.FC = () => {
  const [newCourse, setNewCourse] = useState<Course>({
    title: "",
    image: "",
    duration: "",
    learners: 0,
    originalPrice: "",
    price: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addCourse(newCourse); //wait for the course to be added
      // Clear the form after adding the course
      setNewCourse({
        title: "",
        image: "",
        duration: "",
        learners: 0,
        originalPrice: "",
        price: "",
      });
    } catch (error) {
      console.error(`Error adding course:`, error);
    }
  };

  return (
    <div className="px-10  text-lg font-bold bg-white m-2 w-3/4 flex justify-center">
      <div className="">
        <form
          onSubmit={handleAddCourse}
          className="flex flex-col text-black p-2 "
        >
          <div>
            <label htmlFor="title">Course Title :</label>
            <input
              type="text"
              name="title"
              value={newCourse.title}
              onChange={handleInputChange}
              placeholder="Course Title"
              required
              className="border border-green-600 w-1/2 m-2 rounded-sm"
            />
          </div>
          <div>
            <label htmlFor="image">Image URL :</label>
          </div>
          <input
            type="text"
            name="image"
            value={newCourse.image}
            onChange={handleInputChange}
            placeholder="Image URL"
            className="border border-green-600 w-1/2 m-2 rounded-sm"
          />
          <div>
            <label htmlFor="duration">Duration :</label>
            <input
              type="text"
              name="duration"
              value={newCourse.duration}
              onChange={handleInputChange}
              placeholder="Duration"
              required
              className="border border-green-600 w-1/2 m-2 rounded-sm"
            />
          </div>
          <div>
            <label htmlFor="learners">Learners :</label>
            <input
              type="number"
              name="learners"
              value={newCourse.learners}
              onChange={handleInputChange}
              placeholder="Learners"
              required
              className="border border-green-600 w-1/2 m-2 rounded-sm"
            />
          </div>
          <div>
            <label htmlFor="originalPrice">Original Price :</label>
            <input
              type="text"
              name="originalPrice"
              value={newCourse.originalPrice}
              onChange={handleInputChange}
              placeholder="Original Price"
              required
              className="border border-green-600 w-1/2 m-2 rounded-sm"
            />
          </div>
          <div>
            <label htmlFor="price">Price :</label>
            <input
              type="text"
              name="price"
              value={newCourse.price}
              onChange={handleInputChange}
              placeholder="Price"
              required
              className="border border-green-600 w-1/2 m-2 rounded-sm"
            />
          </div>
          <button
            type="submit"
            className="border border-green-600 w-1/4 m-4 bg-green-600 p-2 rounded-lg hover:bg-green-900 "
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseAdmin;
