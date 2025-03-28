"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getQuestions,
  updateQuestion,
  deleteQuestion,
} from "@/lib/actions/user.actions";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  MoreVertical,
  Edit,
  Trash2,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CreateQuestionModal from "./CreateQuestionModal"; // adjust the import path as needed

import { toast } from "sonner";

// Advanced Types with Comprehensive Metadata
type QuestionStatus = "draft" | "published" | "archived";
type SortOption = "newest" | "oldest" | "most_replied";

type AdvancedQuestion = {
  $id: string;
  user_id: string;
  question: string;
  status: QuestionStatus;
  $createdAt: string;
  $updatedAt?: string;
  replies_count: number;
  tags?: string[];
  user?: {
    firstname?: string;
    avatar?: string;
  };
  replies?: {
    id: string;
    content: string;
    $createdAt: string;
    user_id: string;
  }[]; // Define a specific type for replies
};

const QuestionsManagement: React.FC = () => {
  // Advanced State Management
  const [questions, setQuestions] = useState<AdvancedQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<
    AdvancedQuestion[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [selectedQuestion, setSelectedQuestion] =
    useState<AdvancedQuestion | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null,
  );

  // Authentication Context
  const { user } = useAuthStore((state) => state);

  // Comprehensive Data Fetching with Advanced Error Handling
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedQuestions = await getQuestions();
      const enrichedQuestions = (fetchedQuestions.documents || []).map(
        (q: AdvancedQuestion) => ({
          ...q,
          replies_count: q.replies?.length || 0,
          status: q.status || "published",
        }),
      );
      setQuestions(enrichedQuestions);
    } catch (error) {
      toast.error("Failed to fetch questions", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Advanced Filtering and Sorting
  useEffect(() => {
    let result = [...questions];

    // Search Filter
    if (searchTerm) {
      result = result.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.user?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Sorting Logic
    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
          );
        case "most_replied":
          return b.replies_count - a.replies_count;
        default:
          return 0;
      }
    });

    setFilteredQuestions(result);
  }, [questions, searchTerm, sortOption]);

  // Optimistic Update Handlers
  const handleUpdateQuestion = async () => {
    if (!selectedQuestion || !user || user.$id !== selectedQuestion.user_id) {
      toast.error("Unauthorized", {
        description: "You can only edit your own questions.",
      });
      return;
    }

    try {
      // Optimistic UI Update
      const optimisticUpdate = {
        ...selectedQuestion,
        $updatedAt: new Date().toISOString(),
      };

      setQuestions((prev) =>
        prev.map((q) =>
          q.$id === selectedQuestion.$id ? optimisticUpdate : q,
        ),
      );

      // Actual Backend Update
      await updateQuestion(selectedQuestion.$id, {
        question: selectedQuestion.question,
      });

      toast.success("Question Updated", {
        description: "Your question has been successfully updated.",
      });

      setEditMode(false);
    } catch (error) {
      toast.error("Update Failed", {
        description: "Unable to update the question. Please try again.",
      });
    }
  };

  const handleDeleteQuestion = async () => {
    if (!deleteConfirmation || !user) return;

    // Find the question to check user authorization
    const questionToDelete = questions.find(
      (q) => q.$id === deleteConfirmation,
    );

    if (!questionToDelete || user.$id !== questionToDelete.user_id) {
      toast.error("Unauthorized", {
        description: "You can only delete your own questions.",
      });
      setDeleteConfirmation(null);
      return;
    }

    try {
      // Optimistic UI Update
      setQuestions((prev) => prev.filter((q) => q.$id !== deleteConfirmation));

      await deleteQuestion(deleteConfirmation);

      toast.success("Question Deleted", {
        description: "The question has been removed successfully.",
      });

      setDeleteConfirmation(null);
    } catch (error) {
      toast.error("Deletion Failed", {
        description: "Unable to delete the question. Please try again.",
      });
    }
  };

  // Lifecycle Management
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Render Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <RefreshCw className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Advanced Search and Filter Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Search questions..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2" size={16} /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOption("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("oldest")}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("most_replied")}>
                Most Replied
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create New Question
        </Button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <div
              key={question.$id}
              className="bg-white border rounded-lg p-4 flex justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex-grow pr-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-semibold text-sm">
                    {question.user?.firstname || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(question.$createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span
                    className={`
                    text-xs px-2 py-1 rounded-full
                    ${
                      question.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : question.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                    }
                  `}
                  >
                    {question.status}
                  </span>
                </div>
                <p className="text-gray-800">{question.question}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Replies: {question.replies_count}
                </div>
              </div>

              {/* Actions Dropdown - Only show for question owner */}
              {user && user.$id === question.user_id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => {
                        setSelectedQuestion(question);
                        setEditMode(true);
                      }}
                    >
                      <Edit className="mr-2" size={16} /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setDeleteConfirmation(question.$id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2" size={16} /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center space-y-4">
            <p>No questions found.</p>
            <p>Try searching for a question or creating a new one.</p>
            <>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create New Question
              </Button>
            </>
          </div>
        )}
      </div>

      {/* Edit Question Dialog */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Make changes to your question here.
            </DialogDescription>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <Textarea
                value={selectedQuestion.question}
                onChange={(e) =>
                  setSelectedQuestion((prev) =>
                    prev ? { ...prev, question: e.target.value } : null,
                  )
                }
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateQuestion}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmation}
        onOpenChange={() => setDeleteConfirmation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmation(null)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuestion}>
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {isCreateModalOpen ? (
        <>
          <CreateQuestionModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
          />
        </>
      ) : null}
    </div>
  );
};

export default QuestionsManagement;
