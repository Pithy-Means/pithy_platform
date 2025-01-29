import { CommentPostWithUser } from "@/types/schema";
import { MessageCircle } from "lucide-react";
import CommentItem from "./CommentItem";

const CommentsList = ({ comments }: { comments: CommentPostWithUser[] }) => {
  if (!comments.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <MessageCircle className="w-14 h-14 text-gray-300 mb-6" />
        <p className="text-xl font-semibold text-gray-600">No comments yet</p>
        <p className="text-sm text-gray-500">Be the first to share your thoughts and start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-inner">
      {comments.map((comment) => (
        <CommentItem key={comment.comment_id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentsList;