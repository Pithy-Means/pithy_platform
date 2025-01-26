import { CommentPostWithUser } from "@/types/schema";
import { Edit, Trash2 } from "lucide-react"; // Icons for actions
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const CommentItem = ({ comment }: { comment: CommentPostWithUser }) => {
  const userName = comment.user
    ? `${comment.user.firstname || "Unknown"} ${comment.user.lastname || ""}`.trim()
    : "Anonymous User";

  const avatarColor = `bg-gradient-to-tr from-green-500 via-white/70 to-green-800`;

  return (
    <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <CardContent className="flex gap-4 items-start">
        {/* Avatar Section */}
        <div
          className={`w-14 h-14 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-xl uppercase`}
        >
          {userName.charAt(0)}
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          {/* Username and Timestamp */}
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold text-gray-900">{userName}</CardTitle>
            {/* <p className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p> */}
          </div>

          {/* Comment Text */}
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">{comment.comment}</p>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center gap-6 justify-end">
            {/* Edit Button */}
            <button
              className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-md transition-all duration-200"
              onClick={() => console.log(`Edit comment: ${comment.comment_id}`)}
            >
              <Edit className="w-5 h-5" />
              <span>Edit</span>
            </button>

            {/* Delete Button */}
            <button
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-md transition-all duration-200"
              onClick={() => console.log(`Delete comment: ${comment.comment_id}`)}
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentItem;