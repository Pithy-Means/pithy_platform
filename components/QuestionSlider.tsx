"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import toast, { Toaster } from "react-hot-toast";
import {
  createPostCourseAnswer,
  fetchAllPostCourseQuestions,
} from "@/lib/actions/user.actions";
import { useQuestionStore } from "@/lib/hooks/useQuestionStore";
import { PostCourseQuestionAnswer, UserInfo } from "@/types/schema";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

const QuestionSlider: React.FC = () => {
  const [allQuestions, setAllQuestions] = useState<
    { id: string; question: string; choices: string[]; category: string }[]
  >([]);
  const [filteredQuestions, setFilteredQuestions] = useState<
    { id: string; question: string; choices: string[]; category: string }[]
  >([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [customAnswer, setCustomAnswer] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const router = useRouter();
  const { user } = useAuthStore((state) => state as unknown as UserInfo);
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    testStarted,
    setTestStarted,
    testCompleted,
    setTestCompleted,
  } = useQuestionStore();

  useEffect(() => {
    // Check localStorage for test completion
    const isTestCompleted = localStorage.getItem("testCompleted");
    if (isTestCompleted === "true") {
      setTestCompleted(true);
      setLoading(false);
      setInitialLoadComplete(true);
    } else {
      const getQuestions = async () => {
        setLoading(true);
        try {
          const fetchedQuestions = await fetchAllPostCourseQuestions();
          setAllQuestions(fetchedQuestions);
        } catch (error) {
          console.error("Error fetching questions:", error);
          toast.error("Failed to fetch questions. Please try again.");
        } finally {
          setLoading(false);
          setInitialLoadComplete(true);
        }
      };

      getQuestions();
    }
  }, [setTestCompleted]);

  // Filter questions based on user categories and auto-redirect if no questions
  useEffect(() => {
    if (initialLoadComplete && allQuestions.length > 0 && user?.categories) {
      const questions = allQuestions.filter((question) =>
        user.categories.includes(question.category),
      );
      setFilteredQuestions(questions);

      // If no questions for this user's categories, mark test as completed and redirect
      if (questions.length === 0) {
        localStorage.setItem("testCompleted", "true");
        setTestCompleted(true);
        // Redirect to courses page since there are no questions to answer
        router.push("/dashboard/courses");
      }

      // Reset question index when questions change
      setCurrentQuestionIndex(0);
    }
  }, [
    user?.categories,
    allQuestions,
    setCurrentQuestionIndex,
    initialLoadComplete,
    router,
    setTestCompleted,
  ]);

  useEffect(() => {
    setSelectedChoice(null);
    setCustomAnswer("");
    setShowCustomInput(false);
  }, [currentQuestionIndex]);

  const handleChoiceSelection = (choice: string) => {
    if (!testStarted) {
      setTestStarted(true);
    }
    setSelectedChoice(choice);
    setShowCustomInput(false);
  };

  const handleCustomOption = () => {
    setSelectedChoice(null);
    setShowCustomInput(true);
    if (!testStarted) {
      setTestStarted(true);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!user?.categories || user.categories.length === 0) {
      toast.error("User category information is missing.");
      return;
    }

    const finalAnswer = showCustomInput ? customAnswer : selectedChoice;

    if (!finalAnswer || (showCustomInput && customAnswer.trim() === "")) {
      toast.error("Please select an answer or provide a custom response.");
      return;
    }

    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const answerData: PostCourseQuestionAnswer = {
      answer_id: `${currentQuestion.id}-${currentQuestionIndex}`,
      username: user?.firstname || "",
      answer: finalAnswer,
      post_course_question_id: currentQuestion.id,
      user_category: currentQuestion.category,
    };

    setLoading(true);

    try {
      await createPostCourseAnswer(answerData);
      toast.success("Answer submitted successfully!");

      if (currentQuestionIndex === filteredQuestions.length - 1) {
        // Test is completed
        localStorage.setItem("testCompleted", "true");
        setTestCompleted(true);
        toast.success("Congratulations! You've completed all questions.");

        // Redirect to courses dashboard page
        setTimeout(() => {
          router.push("/dashboard/courses");
        }, 1500);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit the answer. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4 flex flex-col items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p>Loading questions...</p>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        <h2 className="text-black text-xl font-bold">Test Completed</h2>
        <p>Thank you for taking the test. You can now access the courses.</p>
        <Button
          onClick={() => router.push("/dashboard/courses")}
          className="bg-[#5AC35A]"
        >
          Go to Courses
        </Button>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    // This shouldn't normally render because the useEffect should redirect
    // but including as a fallback
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        <h2 className="text-black text-xl font-bold">No Questions Available</h2>
        <p>
          There are no questions for your profile category. You can access the
          courses now.
        </p>
        <Button
          onClick={() => {
            localStorage.setItem("testCompleted", "true");
            setTestCompleted(true);
            router.push("/dashboard/courses");
          }}
          className="bg-[#5AC35A]"
        >
          Go to Courses
        </Button>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <h2 className="text-black text-xl font-bold">
        {filteredQuestions[currentQuestionIndex]?.question}
      </h2>
      <div className="space-y-2">
        {filteredQuestions[currentQuestionIndex]?.choices.map(
          (choice, index) => (
            <Button
              key={index}
              onClick={() => handleChoiceSelection(choice)}
              className={`w-full text-lg text-black ${
                selectedChoice === choice ? "bg-[#5AC35A]" : "bg-[#f0f0f0]"
              } p-3 text-left rounded-md hover:bg-opacity-90 transition-colors`}
            >
              {choice}
            </Button>
          ),
        )}

        {/* Custom answer button */}
        <Button
          onClick={handleCustomOption}
          className={`w-full text-lg text-black ${
            showCustomInput ? "bg-[#5AC35A]" : "bg-[#f0f0f0]"
          } p-3 text-left rounded-md hover:bg-opacity-90 transition-colors`}
        >
          Other (provide your own answer)
        </Button>

        {/* Custom answer input field */}
        {showCustomInput && (
          <div className="mt-2">
            <Input
              type="text"
              placeholder="Type your answer here..."
              value={customAnswer}
              onChange={(e) => setCustomAnswer(e.target.value)}
              className="w-full p-3 border rounded-md"
            />
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        {currentQuestionIndex > 0 && (
          <Button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            className="bg-[#FF5C5C] hover:bg-opacity-90 transition-colors"
          >
            Previous
          </Button>
        )}
        <Button
          onClick={handleSubmitAnswer}
          className={`bg-[#5AC35A] hover:bg-opacity-90 transition-colors ${currentQuestionIndex === 0 && "ml-auto"}`}
          disabled={loading}
        >
          {currentQuestionIndex === filteredQuestions.length - 1
            ? "Submit Test"
            : "Next"}
        </Button>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default QuestionSlider;
