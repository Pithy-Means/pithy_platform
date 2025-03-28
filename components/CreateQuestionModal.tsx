"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { createQuestion } from "@/lib/actions/user.actions";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { UserInfo } from "@/types/schema";
import { toast } from "sonner";

// Zod schema for form validation (reusing from original component)
const QuestionSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  question_id: z
    .string()
    .min(5, "Question ID must be at least 5 characters")
    .max(50, "Question ID must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Question ID can only contain letters, numbers, hyphens, and underscores",
    ),
  question: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .max(500, "Question must be less than 500 characters"),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Extend the type to include form-specific properties
type QuestionFormData = z.infer<typeof QuestionSchema>;

type CreateQuestionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuthStore((state) => state as unknown as UserInfo);

  // Initialize the form with react-hook-form and zod
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      user_id: user.user_id,
      question_id: crypto.randomUUID(), // Generate a unique ID automatically
      question: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: QuestionFormData) => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields are populated
      const questionData = {
        ...data,
        question_id: data.question_id || crypto.randomUUID(),
      };

      const result = await createQuestion(questionData);

      if (result) {
        // Reset form
        form.reset({
          user_id: user.user_id,
          question_id: crypto.randomUUID(),
          question: "",
        });

        // Use toast for success notification
        toast("Question Created", {
          description: "Your question has been successfully submitted.",
        });

        // Close the modal
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating question:", error);

      // Use toast for error notification
      toast("Error", {
        description: "Failed to create question. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Create a New Question
          </DialogTitle>
          <DialogDescription>
            Ask a clear, concise question to get the best answers.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your question in detail..."
                      className="min-h-[150px] bg-white text-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Ask Question"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestionModal;
