"use client";

import {
  createQuestion,
  deleteQuestion,
  fetchQuestions,
  updateQuestion,
} from "@/lib/actions/user.actions";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Answer, Question, UserInfo } from "@/types/schema";
import { useState, useEffect } from "react";

export default function QuestionManagement() {
  const { user } = useAuthStore((state) => state as unknown as UserInfo);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingOption, setEditingOption] = useState({
    text: "",
    score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
  });
  const [newQuestion, setNewQuestion] = useState<Question>({
    pre_course_question_id: "",
    user_id: user ? user?.user_id : "",
    text: "",
    category: "",
    options: [],
  });
  const [newOption, setNewOption] = useState({
    text: "",
    score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
  });

  const handleAddOption = () => {
    if (newOption.text.trim() === "") return;

    const option = {
      answer_id: "",
      text: newOption.text,
      score: newOption.score,
    };

    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, option],
    });

    setNewOption({
      text: "",
      score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
    });
  };

  const handleAddOptionToEditing = () => {
    if (!editingQuestion || editingOption.text.trim() === "") return;

    const option = {
      answer_id: "",
      text: editingOption.text,
      score: editingOption.score,
    };

    setEditingQuestion({
      ...editingQuestion,
      options: [...editingQuestion.options, option],
    });

    setEditingOption({
      text: "",
      score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
    });
  };

  const handleEditOption = (
    index: number,
    field: string,
    value: string | number | object
  ) => {
    if (!editingQuestion) return;

    const updatedOptions = [...editingQuestion.options];

    if (field === "text") {
      updatedOptions[index] = {
        ...updatedOptions[index],
        text: value as string,
      };
    } else if (field === "score" && typeof value === "object") {
      updatedOptions[index] = {
        ...updatedOptions[index],
        score: value as {
          E: number;
          I: number;
          S: number;
          N: number;
          T: number;
          F: number;
          J: number;
          P: number;
        },
      };
    }

    setEditingQuestion({
      ...editingQuestion,
      options: updatedOptions,
    });
  };

  const handleRemoveOption = (index: number) => {
    if (!editingQuestion) return;

    const updatedOptions = [...editingQuestion.options];
    updatedOptions.splice(index, 1);

    setEditingQuestion({
      ...editingQuestion,
      options: updatedOptions,
    });
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    try {
      setLoading(true);
      const data = await fetchQuestions();
      // Parse the options from JSON strings back to objects
      const parsedData = data.map((question) => ({
        ...question,
        options: Array.isArray(question.options)
          ? question.options.map((option: string | Answer) =>
              typeof option === "string" ? JSON.parse(option) : option
            )
          : [],
      }));
      setQuestions(parsedData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      setLoading(true);
      console.log("Creating question...");


        // console.log("Question to create:", questionToCreate);

      await createQuestion(newQuestion);

      setNewQuestion({
        pre_course_question_id: '',
        user_id: user?.user_id,
        text: '',
        category: '',
        options: [
          { answer_id: '', text: '', score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
        ]
      });
      console.log("New question created successfully.");
      await getQuestions();
    } catch (error) {
      console.error("Error creating question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteQuestion(id);
      console.log("Question deleted successfully.");
      await getQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    try {
      setLoading(true);

      // Create a clean version of the question without system fields
      const cleanedQuestion = {
        text: editingQuestion.text,
        category: editingQuestion.category,
        options: editingQuestion.options.map((option) => ({
          answer_id: option.answer_id || "",
          text: option.text,
          score: { ...option.score },
        })),
      };

      await updateQuestion(
        editingQuestion.pre_course_question_id,
        cleanedQuestion
      );

      setEditingQuestion(null);
      await getQuestions();
    } catch (error) {
      console.error("Error updating question:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Admin Dashboard</h1>

      <div className="mb-10 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-black">
          Create New Question
        </h2>
        <div className="mb-4">
          <label className="block mb-2 text-black">Question Text</label>
          <input
            type="text"
            value={newQuestion.text}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, text: e.target.value })
            }
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-black">Category</label>
          <input
            type="text"
            value={newQuestion.category}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, category: e.target.value })
            }
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
              onChange={(e) =>
                setNewOption({ ...newOption, text: e.target.value })
              }
              className="w-full p-2 border rounded mb-3 text-black"
            />

            <div className="grid grid-cols-4 gap-2">
              {Object.entries(newOption.score).map(([dimension, score]) => (
                <div key={dimension}>
                  <label className="block text-sm text-black">
                    {dimension}
                  </label>
                  <input
                    type="number"
                    value={score}
                    onChange={(e) =>
                      setNewOption({
                        ...newOption,
                        score: {
                          ...newOption.score,
                          [dimension]: parseInt(e.target.value) || 0,
                        },
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
              <div
                key={question.pre_course_question_id}
                className="p-4 border rounded"
              >
                {editingQuestion?.pre_course_question_id ===
                question.pre_course_question_id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-black">
                        Question Text
                      </label>
                      <input
                        type="text"
                        value={editingQuestion.text}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            text: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded mb-2"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-black">Category</label>
                      <input
                        type="text"
                        value={editingQuestion.category}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            category: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded mb-2"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold mb-2 text-black">Options</h3>
                      {editingQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className="mb-4 p-3 border rounded bg-gray-50"
                        >
                          <label className="block mb-2 text-black">
                            Option Text
                          </label>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              handleEditOption(index, "text", e.target.value)
                            }
                            className="w-full p-2 border rounded mb-3 text-black"
                          />

                          <div className="grid grid-cols-4 gap-2">
                            {Object.entries(option.score).map(
                              ([dimension, score]) => (
                                <div key={dimension}>
                                  <label className="block text-sm text-black">
                                    {dimension}
                                  </label>
                                  <input
                                    type="number"
                                    value={score as number}
                                    onChange={(e) => {
                                      const newScore = {
                                        ...option.score,
                                        [dimension]:
                                          parseInt(e.target.value) || 0,
                                      };
                                      handleEditOption(
                                        index,
                                        "score",
                                        newScore
                                      );
                                    }}
                                    className="w-full p-1 border rounded text-black"
                                  />
                                </div>
                              )
                            )}
                          </div>

                          <button
                            onClick={() => handleRemoveOption(index)}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
                          >
                            Remove Option
                          </button>
                        </div>
                      ))}

                      {/* Add new option to existing question */}
                      <div className="mt-4 p-3 border rounded bg-gray-50">
                        <h4 className="font-semibold mb-2 text-black">
                          Add New Option
                        </h4>
                        <label className="block mb-2 text-black">
                          Option Text
                        </label>
                        <input
                          type="text"
                          value={editingOption.text}
                          onChange={(e) =>
                            setEditingOption({
                              ...editingOption,
                              text: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded mb-3 text-black"
                        />

                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(editingOption.score).map(
                            ([dimension, score]) => (
                              <div key={dimension}>
                                <label className="block text-sm text-black">
                                  {dimension}
                                </label>
                                <input
                                  type="number"
                                  value={score}
                                  onChange={(e) =>
                                    setEditingOption({
                                      ...editingOption,
                                      score: {
                                        ...editingOption.score,
                                        [dimension]:
                                          parseInt(e.target.value) || 0,
                                      },
                                    })
                                  }
                                  className="w-full p-1 border rounded text-black"
                                />
                              </div>
                            )
                          )}
                        </div>

                        <button
                          onClick={handleAddOptionToEditing}
                          className="mt-3 px-3 py-1 bg-gray-200 rounded text-black"
                        >
                          Add Option
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={handleUpdateQuestion}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                      >
                        Save Question
                      </button>
                      <button
                        onClick={() => setEditingQuestion(null)}
                        className="px-4 py-2 bg-gray-200 rounded text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold">{question.text}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Category: {question.category}
                    </p>

                    <div className="mt-2">
                      <h4 className="font-semibold text-sm">Options:</h4>
                      <ul className="ml-5 list-disc">
                        {question.options.map((option, index) => (
                          <li key={index} className="text-sm">
                            {option.text}
                          </li>
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
                        onClick={() =>
                          handleDeleteQuestion(question.pre_course_question_id)
                        }
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
