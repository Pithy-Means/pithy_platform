import React from "react";
import dayjs from "dayjs";

interface Comment {
  $id: string;
  comment: string;
  created_at: string;
}

interface CommentSectionProps {
  postId: string;
  comments: { [key: string]: Comment[] };
  fetchComments: (postId: string) => void;
  newComment: { [key: string]: string };
  setNewComment: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  addComment: (postId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  fetchComments,
  newComment,
  setNewComment,
  addComment,
}) => {
  return (
    <div className="mt-4">
      <button onClick={() => fetchComments(postId)} className="text-blue-500 text-sm">
        View Comments
      </button>
      {comments[postId] && (
        <div className="mt-2 space-y-2">
          {comments[postId].map((comment) => (
            <div key={comment.$id} className="border-t border-gray-200 pt-2">
              <p>{comment.comment}</p>
              <small className="text-gray-500">{dayjs(comment.created_at).fromNow()}</small>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center mt-2">
        <textarea
          value={newComment[postId] || ""}
          onChange={(e) =>
            setNewComment((prev) => ({ ...prev, [postId]: e.target.value }))
          }
          placeholder="Add a comment"
          className="border border-gray-300 rounded-md p-2 w-full"
        />
        <button
          onClick={() => addComment(postId)}
          className="bg-blue-500 text-white rounded-md px-4 py-2 ml-2 hover:bg-blue-600"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentSection;