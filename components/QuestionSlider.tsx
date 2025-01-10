"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button } from "./ui/button";
import { createPostCourseAnswer, fetchAllPostCourseQuestions } from "@/lib/actions/user.actions";
import { useQuestionStore } from "@/lib/hooks/useQuestionStore";
import { PostCourseQuestionAnswer } from "@/types/schema";
import PaymentButton from "./PaymentButton";
import { UserContext } from "@/context/UserContext";

const QuestionSlider: React.FC = () => {
  const [questions, setQuestions] = useState<{ id: string; question: string; choices: string[] }[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const { user } = useContext(UserContext);
  const { currentQuestionIndex, setCurrentQuestionIndex } = useQuestionStore();

  useEffect(() => {
    // Check if the test was already completed
    const isTestCompleted = localStorage.getItem("testCompleted");
    if (isTestCompleted === "true") {
      setTestCompleted(true);
    } else {
      // Fetch questions if the test is not completed
      const getQuestions = async () => {
        setLoading(true);
        try {
          const fetchedQuestions = await fetchAllPostCourseQuestions();
          setQuestions(fetchedQuestions);
        } catch (error) {
          console.error("Error fetching questions:", error);
          alert("Failed to fetch questions.");
        } finally {
          setLoading(false);
        }
      };
  
      getQuestions();
    }

  }, []);

  useEffect(() => {
    setSelectedChoice(null);
  }, [currentQuestionIndex]);

  const handleChoiceSelection = (choice: string) => {
    setSelectedChoice(choice);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedChoice) {
      alert("Please select an answer.");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const answerData: PostCourseQuestionAnswer = {
      answer_id: `${currentQuestion.id}-${currentQuestionIndex}`,
      username: user?.firstname || "",
      answer: selectedChoice,
      post_course_question_id: currentQuestion.id,
    };

    try {
      await createPostCourseAnswer(answerData);

      if (currentQuestionIndex === questions.length - 1) {
        // Mark the test as completed in localStorage
        localStorage.setItem("testCompleted", "true");
        setTestCompleted(true);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit the answer. Please try again later.");
    }
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (questions.length === 0 && testCompleted) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4 text-center">
        <h2 className="text-xl font-bold">Thank you for completing the test!</h2>
        <p className="text-gray-600">To proceed, please complete your payment.</p>
        <PaymentButton />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <h2 className="text-black/5 text-xl font-bold">{questions[currentQuestionIndex]?.question}</h2>
      <div className="space-y-2">
        {questions[currentQuestionIndex]?.choices.map((choice, index) => (
          <Button
            key={index}
            onClick={() => handleChoiceSelection(choice)}
            className={`w-full text-black/15 ${
              selectedChoice === choice ? "bg-[#5AC35A]" : "bg-[#f0f0f0]"
            } p-3 text-left rounded-md`}
          >
            {choice}
          </Button>
        ))}
      </div>
      <div className="flex justify-between items-center">
        {currentQuestionIndex > 0 && (
          <Button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            className="bg-[#FF5C5C]"
          >
            Previous
          </Button>
        )}
        <Button
          onClick={handleSubmitAnswer}
          className="bg-[#5AC35A] justify-self-end"
        >
          {currentQuestionIndex === questions.length - 1 ? "Submit Test" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default QuestionSlider;
