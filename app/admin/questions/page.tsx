"use client";

import { createQuestion } from '@/lib/actions/user.actions';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Question, UserInfo } from '@/types/schema';
import { useState, useEffect } from 'react';

export default function QuestionManagement() {
  const { user } = useAuthStore((state) => state as unknown as UserInfo);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
      pre_course_question_id: '', // Initialize with an empty string
      user_id: user ? user?.user_id : '',
      text: '',
      category: '',
      options: []
    });
  const [newOption, setNewOption] = useState({
    text: '',
    score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
  });
  console.log('User id:', user?.user_id);

  const handleAddOption = () => {
    if (newOption.text.trim() === '') return;
    
    const option = {
      answer_id: '',
      text: newOption.text,
      score: newOption.score
    };
    
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, option]
    });
    
    setNewOption({
      text: '',
      score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/question/fetch');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      // if (!user.user_id) return;
      // if (!newQuestion.text || !newQuestion.category) return;
      // if (newQuestion.options.length === 0) return;
      // if (newQuestion.options.some(option => option.text.trim() === '')) return;
      // if (newQuestion.options.some(option => Object.values(option.score).some(score => score < 0))) return;
      // if (newQuestion.options.some(option => Object.values(option.score).some(score => score > 5))) return;
      // if (!newQuestion.text || newQuestion.options.length === 0) return;
      
      setLoading(true);
      console.log("Creating question...");
      
      const res = await createQuestion(newQuestion);
      
      if (res) {
        setNewQuestion({
          pre_course_question_id: '',
          user_id: user.user_id,
          text: '',
          category: '',
          options: []
        });
        console.log("New question created successfully.");
        await fetchQuestions();
      }
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const res = await fetch(`/api/question/fetch/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        await fetchQuestions();
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;
    
    try {
      const res = await fetch(`/api/question/fetch/${editingQuestion.pre_course_question_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingQuestion)
      });
      
      if (res.ok) {
        setEditingQuestion(null);
        await fetchQuestions();
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Admin Dashboard</h1>
      
      <div className="mb-10 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-black">Create New Question</h2>
        <div className="mb-4">
          <label className="block mb-2 text-black">Question Text</label>
          <input
            type="text"
            value={newQuestion.text}
            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-black">Category</label>
          <input
            type="text"
            value={newQuestion.category}
            onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        
        <div className="mb-4">
          <h3 className="font-bold mb-2 text-black">Options</h3>
          
          {newQuestion.options.map((option, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <p className="font-semibold text-black">{option.text}</p>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {Object.entries(option.score).map(([dimension, score]) => (
                  <span key={dimension} className="text-sm text-gray-600">
                    {dimension}: {score as number}
                  </span>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-3 border rounded bg-gray-50">
            <label className="block mb-2 text-black">New Option Text</label>
            <input
              type="text"
              value={newOption.text}
              onChange={(e) => setNewOption({ ...newOption, text: e.target.value })}
              className="w-full p-2 border rounded mb-3 text-black"
            />
            
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(newOption.score).map(([dimension, score]) => (
                <div key={dimension}>
                  <label className="block text-sm text-black">{dimension}</label>
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => 
                      setNewOption({
                        ...newOption, 
                        score: {
                          ...newOption.score,
                          [dimension]: parseInt(e.target.value) || 0
                        }
                      })
                    }
                    className="w-full p-1 border rounded text-black"
                  />
                </div>
              ))}
            </div>
            
            <button
              onClick={handleAddOption}
              className="mt-3 px-3 py-1 bg-gray-200 rounded text-black"
            >
              Add Option
            </button>
          </div>
        </div>
        
        <button
          onClick={handleCreateQuestion}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create Question
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">All Questions</h2>
        
        {questions.length === 0 ? (
          <p>No questions available</p>
        ) : (
          <div className="space-y-4 text-black">
            {questions.map((question) => (
              <div key={question.pre_course_question_id} className="p-4 border rounded">
                {editingQuestion?.pre_course_question_id === question.pre_course_question_id ? (
                  <>
                    <input
                      type="text"
                      value={editingQuestion.text}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={handleUpdateQuestion}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingQuestion(null)}
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold">{question.text}</h3>
                    <p className="text-sm text-gray-500 mt-1">Category: {question.category}</p>
                    
                    <div className="mt-2">
                      <h4 className="font-semibold text-sm">Options:</h4>
                      <ul className="ml-5 list-disc">
                        {question.options.map((option) => (
                          <li key={option.answer_id} className="text-sm">{option.text}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => setEditingQuestion(question)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.pre_course_question_id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}