"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { UserContext } from "@/context/UserContext";
import { Courses, PaymentData } from "@/types/schema";
import { Label } from "./ui/label";

const PaymentButton = () => {
  const [formData, setFormData] = useState<PaymentData>({
    course_choice: "",
    amount: 0,
    tx_ref: "",
  });
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<Courses[]>([]);
  const { user } = useContext(UserContext);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch("/api/get-courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Course data", data);
        if (response.ok) {
          setCourse(data.data);
        } else {
          console.error("Failed to fetch course:", data);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    fetchCourse();
  }, []);

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/proxy-flutterwave/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tx_ref: Date.now().toString(),
          amount: 20000,
          email: user?.email,
          name: `${user?.lastname} ${user?.firstname}`,
        }),
      });

      const data = await response.json();
      console.log("payemnt Link", data);
      if (response.ok) {
        window.location.href = data.link; // Redirect to Flutterwave payment link
      } else {
        console.error("Payment initiation failed:", data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={initiatePayment} className="flex flex-col space-y-4">
      <div>
        <Label
          htmlFor="course_choice"
          className="block text-sm font-medium text-gray-700"
        >
          Select Course
        </Label>
        <select
          id="course_choice"
          name="course_choice"
          value={formData.course_choice}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          required
        >
          <option value="">Select Course</option>
          {course.map((course: Courses) => (
            <option key={course.course_id} value={course.course_id}>
              {course.title} - UGX {course.price} - {course.categories}
            </option>
          ))}
        </select>
      </div>
      <Button
        className="bg-[#5AC35A] text-white px-4 py-2 rounded-lg"
        onClick={initiatePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

export default PaymentButton;
