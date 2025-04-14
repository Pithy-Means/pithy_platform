"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Question, UserResponse, TemperamentResult } from '@/types/schema';
import { calculateTemperamentType, getTemperamentDescription } from '@/utils/temperament';

export default function QuestionPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [result, setResult] = useState<TemperamentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/question/fetch');
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        } else {
          console.error('Failed to fetch questions');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAnswer = (answerId: string) => {
    const questionId = questions[currentQuestionIndex].pre_course_question_id;
    const newResponse: UserResponse = { questionId, answerId };
    
    setResponses([...responses, newResponse]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate result if all questions answered
      const type = calculateTemperamentType(
        [...responses, newResponse],
        questions
      );
      setResult(getTemperamentDescription(type));
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
        <Link href="/admin" className="px-4 py-2 bg-blue-500 text-white rounded">
          Go to Admin
        </Link>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Your Temperament Type: {result.type}</h1>
        <p className="mb-4">{result.description}</p>
        
        <h2 className="text-xl font-bold mb-2">Recommended Careers:</h2>
        <ul className="list-disc pl-5 mb-6">
          {result.careers.map((career, index) => (
            <li key={index}>{career}</li>
          ))}
        </ul>
        
        <button 
          onClick={() => {
            setResponses([]);
            setCurrentQuestionIndex(0);
            setResult(null);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Take Test Again
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

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
        {currentQuestion.options.map(option => (
          <button
            key={option.answer_id}
            onClick={() => handleAnswer(option.answer_id)}
            className="w-full py-2 px-4 border rounded-lg hover:bg-gray-100 text-left"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}