"use client";

import React, { useState, useCallback, memo } from "react";
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

// Memoized button component to reduce re-renders
const ActionButton = memo(
  ({
    icon: Icon,
    label,
    onClick,
  }: {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="flex flex-col space-y-1 items-center transition-colors hover:text-blue-500"
    >
      <Icon size={24} strokeWidth={2} />
      <span className="text-sm">{label}</span>
    </button>
  ),
);
ActionButton.displayName = "ActionButton";

// Memoized user info component
const UserInfo = memo(({ post }: { post: PostWithUser }) => (
  <div className="flex items-center space-x-2">
    <CircleUserRound size={40} />
    <div className="flex flex-col space-y-0.5">
      <p className="font-semibold">
        {post.user
          ? `${post.user.firstname || "Unknown"} ${post.user.lastname || ""}`
          : "Anonymous"}
      </p>
      <p className="text-sm text-gray-500 font-light">
        {dayjs(post!.$createdAt).fromNow()}
      </p>
    </div>
  </div>
));
UserInfo.displayName = "UserInfo";

// Memoized post content component with lazy loading
const PostContent = memo(
  ({
    post_id,
    content,
    image,
    video,
    isExpanded,
    onToggleExpand,
  }: {
    post_id: string;
    content: string;
    image?: string;
    video?: string;
    isExpanded: boolean;
    onToggleExpand: () => void;
  }) => {
    const truncatedContent =
      content?.length > 100 ? content?.slice(0, 100) + "..." : content;

    return (
      <div className="flex flex-col space-y-4">
        <p>{isExpanded ? content : truncatedContent}</p>
        {content?.length > 100 && (
          <button
            onClick={onToggleExpand}
            className="text-green-500 underline w-fit"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
        {image && (
          <Image
            src={image}
            alt="Post Image"
            width={800}
            height={400}
            className="h-80 w-full rounded-md"
            unoptimized
          />
        )}
        {video && (
          <Video
            src={video}
            controls
            width={'800'}
            height={'400'}
            className="h-72 w-full rounded-md"
            moduleId={post_id}
            onComplete={() => {}}
          />
        )}
      </div>
    );
  },
);
PostContent.displayName = "PostContent";

// Main PostItem component
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

  // Memoized handlers
  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleUpdate = useCallback(() => {
    if (editingPostId) {
      onUpdate(editingPostId, editedContent);
      setEditingPostId(null);
    }
  }, [editingPostId, editedContent, onUpdate]);

  const handleToggleComments = useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  const handleLike = useCallback(() => {
    onLike(post.post_id || "");
  }, [post.post_id, onLike]);

  const handleDelete = useCallback(() => {
    onDelete(post.post_id || "");
    setShowOptions(false);
  }, [post.post_id, onDelete]);

  const handleEditClick = useCallback(() => {
    setEditingPostId(post.post_id || "");
    setEditedContent(post.content || "");
    setShowOptions(false);
  }, [post.post_id, post.content]);

  const handleRepost = useCallback(() => {
    setRepostingPostId(post.post_id || "");
  }, [post.post_id]);

  const handleSubmitRepost = useCallback(() => {
    onRepost(post, repostContent);
    setRepostingPostId(null);
    setRepostContent("");
  }, [post, repostContent, onRepost]);

  const handleAddComment = useCallback(() => {
    if (newComment.trim()) {
      onAddComment(post.post_id || "", newComment);
      setNewComment("");
    }
  }, [post.post_id, newComment, onAddComment]);

  // Render optimizations - only render expensive parts when needed
  return (
    <div className="border border-gray-300 rounded-md p-4 bg-white/10 overflow-y-auto w-full">
      <div className="flex flex-col space-y-6 py-4">
        <div className="flex items-center justify-between">
          <UserInfo post={post} />

          {loggedInUserId === post.user_id && (
            <div className="relative">
              <HiOutlineDotsVertical
                className="text-gray-500 cursor-pointer"
                onClick={() => setShowOptions(!showOptions)}
              />
              {showOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md flex flex-col space-y-2 shadow-lg z-10">
                  <Button
                    onClick={handleEditClick}
                    type="submit"
                    className="w-full text-black/30 bg-slate-400 text-left p-2 hover:bg-green-600"
                  >
                    <FilePenLine /> Edit
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="w-full text-black/30 bg-slate-400 text-left p-2 hover:bg-yellow-200"
                  >
                    <Trash2 /> Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <PostContent
          content={post.content || ""}
          image={post.image}
          video={post.video}
          isExpanded={isExpanded}
          onToggleExpand={handleToggleExpand}
          post_id={post.post_id || ""}
        />
      </div>

      {editingPostId === post.post_id && (
        <div className="mt-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <div className="mt-2 flex space-x-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
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
          <button onClick={handleToggleComments} className="text-blue-500">
            {showComments ? "Hide Comments" : "Show Comments"} (
            {comments.length})
          </button>
        </div>

        <div className="w-full bg-gray-300 h-0.5 rounded" />

        <div className="flex space-x-8 items-center justify-between">
          <ActionButton icon={ThumbsUp} label="Like" onClick={handleLike} />
          <ActionButton
            icon={MessageCircleMore}
            label="Comment"
            onClick={handleToggleComments}
          />
          <ActionButton icon={BookCopy} label="Repost" onClick={handleRepost} />
          <ActionButton icon={Share} label="Share" />
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
                onClick={handleSubmitRepost}
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
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md"
                disabled={!newComment.trim()}
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

export default memo(PostItem);
