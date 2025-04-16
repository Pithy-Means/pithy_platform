"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Question, UserResponse, TemperamentResult, Answer, UserInfo } from '@/types/schema';
import { calculateTemperamentTypeFromRawAnswers, getTemperamentDescription } from '@/utils/temperament';
import { fetchQuestions, saveResult } from '@/lib/actions/user.actions';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function QuestionPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); // Array of answer indices
  const [responses, setResponses] = useState<UserResponse[]>([]); // Keep for database compatibility
  const [result, setResult] = useState<TemperamentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingResult, setSavingResult] = useState(false);
  const { user } = useAuthStore((state) => state as unknown as UserInfo); // Get current user

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch questions from API
        const data = await fetchQuestions();
        
        // Parse the options from JSON strings back to objects
        const parsedData = data.map(question => ({
          ...question,
          options: Array.isArray(question.options)
            ? question.options.map((option: string | Answer) => 
              typeof option === 'string' ? JSON.parse(option) : option)
            : []
        }));
        
        setQuestions(parsedData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAnswer = async (answerId: string, answerIndex: number) => {
    const questionId = questions[currentQuestionIndex].pre_course_question_id;
    
    // Save for database compatibility
    const newResponse: UserResponse = { questionId, answerId };
    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    
    // Save selected answer index for temperament calculation
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(updatedSelectedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate result using our improved function when all questions are answered
      const type = calculateTemperamentTypeFromRawAnswers(updatedSelectedAnswers, questions);
      const temperamentResult = getTemperamentDescription(type);
      setResult(temperamentResult);
      
      // Save result to database if user is authenticated
      if (user && user.user_id) {
        try {
          setSavingResult(true);
          await saveResult(user.user_id, type, updatedResponses);
        } catch (error) {
          console.error('Error saving result:', error);
        } finally {
          setSavingResult(false);
        }
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">No questions available</h1>
        <p className="mb-4">Please add questions to the database first.</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-black">Your Temperament Type: {result.type}</h1>
        <p className="mb-4 text-black">{result.description}</p>
        
        <h2 className="text-xl font-bold mb-2 text-black">Recommended Careers:</h2>
        <ul className="list-disc pl-5 mb-6">
          {result.careers.map((career, index) => (
            <li key={index} className="text-black">{career}</li>
          ))}
        </ul>
        
        {savingResult && <p className="text-sm text-gray-500 mb-4">Saving your results...</p>}
        
        <div className="flex space-x-4">
          <button 
            onClick={() => {
              setResponses([]);
              setSelectedAnswers([]);
              setCurrentQuestionIndex(0);
              setResult(null);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Take Test Again
          </button>
          
          <Link href="/profile" className="px-4 py-2 bg-green-500 text-white rounded">
            View Profile
          </Link>
        </div>
      </div>
    );
  }

  // Make sure we have a valid current question and it has parsed options
  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion || !Array.isArray(currentQuestion.options)) {
    return <div className="flex justify-center items-center h-screen">Error loading question data</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Self-Discovery Assessment</h1>
      <div className="mb-4">
        <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <h2 className="text-xl mb-4">{currentQuestion.text}</h2>
      
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={option.answer_id}
            onClick={() => handleAnswer(option.answer_id, index)} // Pass both answer ID and index
            className="w-full py-2 px-4 border rounded-lg hover:bg-gray-100 text-left text-black transition duration-200"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}