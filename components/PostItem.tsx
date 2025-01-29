import React, { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  ThumbsUp,
  MessageCircleMore,
  BookCopy,
  Share,
  CircleUserRound,
  Trash2,
  FilePenLine,
} from "lucide-react";
import Image from "next/image";
import { Video } from "./Video";
import { Button } from "./ui/button";
import { PostWithUser, CommentPostWithUser } from "@/types/schema";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentsList from "./CommentList";

dayjs.extend(relativeTime);

interface PostItemProps {
  post: PostWithUser;
  loggedInUserId: string | null;
  likeStatus: { isLiked: boolean; likeCount: number };
  comments: CommentPostWithUser[];
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onUpdate: (postId: string, content: string) => void;
  onAddComment: (postId: string, comment: string) => void;
  onRepost: (post: PostWithUser, comment: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  loggedInUserId,
  likeStatus,
  comments,
  onLike,
  onDelete,
  onUpdate,
  onAddComment,
  onRepost,
}) => {
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false);
  const [repostContent, setRepostContent] = useState<string>("");
  const [repostingPostId, setRepostingPostId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  console.log("COmments", comments);

  const truncatedContent =
  (post?.content?.length ?? 0) > 100 ? post?.content?.slice(0, 100) + "..." : (post?.content ?? "");

  const handleUpdate = () => {
    if (editingPostId) {
      onUpdate(editingPostId, editedContent);
      setEditingPostId(null);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 bg-white/10">
      <div className="flex flex-col space-y-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CircleUserRound size={40} />
            <div className="flex flex-col space-y-1">
              <p className="font-semibold">
                {post.user
                  ? `${post.user.firstname || "Unknown"} ${post.user.lastname || ""}`
                  : "Anonymous"}
              </p>
              <p className="text-sm text-gray-500 font-light">
                {/* {dayjs(post?.createdAt).fromNow()} */}
              </p>
            </div>
          </div>
          {loggedInUserId === post.user_id && (
            <div className="relative">
              <HiOutlineDotsVertical
                className="text-gray-500 cursor-pointer"
                onClick={() => setShowOptions(!showOptions)}
              />
              {showOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md flex flex-col space-y-2 shadow-lg z-10">
                  <Button
                    onClick={() => {
                      setEditingPostId(post.post_id || "");
                      setEditedContent(post.content || "");
                      setShowOptions(false);
                    }}
                    type="submit"
                    className="w-full text-black/30 bg-slate-400 text-left p-2 hover:bg-green-600"
                  >
                    <FilePenLine />
                    {" "}
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      onDelete(post.post_id || "");
                      setShowOptions(false);
                    }}
                    className="w-full text-black/30 bg-slate-400 text-left p-2 hover:bg-yellow-200"
                  >
                    <Trash2 />
                    {" "}
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-4">
        <p>{isExpanded ? post.content : truncatedContent}</p>
          {(post?.content?.length ?? 0) > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 underline"
            >
              {isExpanded ? "Collapse" : "View"}
            </button>
          )}
          {post.image && (
            <Image
              src={post.image}
              width={800}
              height={100}
              alt="Post Image"
              unoptimized
              className="h-56 w-full object-cover rounded-md"
            />
          )}
          {post.video && (
            <Video
              src={post.video}
              controls
              width="800"
              height="100"
              className="h-56 w-full object-cover rounded-md"
            />
          )}
        </div>
      </div>

      {editingPostId === post.post_id && (
        <div className="mt-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <div className="mt-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setEditingPostId(null)}
              className="bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 items-center">
            <div className="bg-green-500 rounded-full p-1 text-white flex items-center justify-center">
              <ThumbsUp size={16} strokeWidth={1} />
            </div>
            <span className="font-normal">{likeStatus.likeCount}</span>
          </div>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-blue-500"
          >
            {showComments ? "Hide Comments" : "Show Comments"} (
            {comments.length})
          </button>
        </div>
        <div className="w-full bg-gray-300 h-0.5 rounded" />
        <div className="flex space-x-8 items-center">
          <button
            onClick={() => onLike(post.post_id || "")}
            className={`flex flex-col space-y-1 items-center`}
          >
            <ThumbsUp size={24} strokeWidth={2} />
            <span className="text-sm">Like</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col space-y-1 items-center"
          >
            <MessageCircleMore />
            <span className="text-sm">Comment</span>
          </button>
          <button
            onClick={() => setRepostingPostId(post.post_id || "")}
            className="flex flex-col space-y-1 items-center"
          >
            <BookCopy />
            <span className="text-sm">Repost</span>
          </button>
          <button className="flex flex-col space-y-1 items-center">
            <Share />
            <span className="text-sm">Share</span>
          </button>
        </div>
        {repostingPostId === post.post_id && (
          <div className="mt-2">
            <textarea
              value={repostContent}
              onChange={(e) => setRepostContent(e.target.value)}
              placeholder="Add your comment to this repost..."
              className="w-full border rounded-md p-2"
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={() => setRepostingPostId(null)}
                className="text-gray-500 underline"
              >
                Cancel
              </button>
              <button
                onClick={() => onRepost(post, repostContent)}
                className="bg-blue-500 text-white rounded-md px-4 py-2"
              >
                Repost
              </button>
            </div>
          </div>
        )}
        {showComments && (
          <div className="mt-4 flex flex-col space-y-4">
            <CommentsList comments={comments} />
            <div className="flex items-center my-2 w-full">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="border rounded-md p-2 w-full"
              />
              <button
                onClick={() => onAddComment(post.post_id || "", newComment)}
                className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md"
              >
                Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostItem;
