/* eslint-disable react-hooks/exhaustive-deps */
import { PostWithUser, LikePost, CommentPostWithUser } from '@/types/schema';
import { useCallback, useEffect } from 'react';
import { getLikesByPostId, getCommentsByPostId, getUserInfo } from '../actions/user.actions';

// Memoized initialization function
const usePostInitialization = (
  fetchedPosts: PostWithUser[], 
  loggedIn: { user_id: string } | null,
  setPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>,
  setComments: React.Dispatch<React.SetStateAction<{ [key: string]: CommentPostWithUser[] }>>,
  setLikeStatus: React.Dispatch<React.SetStateAction<{ [key: string]: { isLiked: boolean; likeCount: number } }>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const initializePosts = useCallback(async () => {
    if (!fetchedPosts.length) return;
  
    try {
      setLoading(true);
  
      // Deduplicate and merge fetched posts with existing posts
      setPosts((prevPosts) => {
        const existingIds = new Set(prevPosts.map((post) => post.post_id));
        const newPosts = fetchedPosts.filter(
          (post) => !existingIds.has(post.post_id)
        );
        return [...prevPosts, ...newPosts.reverse()];
      });
  
      // Fetch likes, comments, and user data for each post
      const postDetails = await Promise.all(
        fetchedPosts.map(async (post) => {
          const [likes, comments] = await Promise.all([
            getLikesByPostId(post.post_id || ''),
            getCommentsByPostId(post.post_id || ''),
          ]);
  
          // Fetch user information for comments
          const updatedComments = await Promise.all(
            comments.map(async (comment: CommentPostWithUser) => {
              const user = await getUserInfo({ userId: comment.user_id });
              console.log("Comments", comment);
              return {
                ...comment,
                user
              };
            })
          );
  
          return {
            postId: post.post_id,
            isLiked: likes.some((like: LikePost) => like.user_id === loggedIn?.user_id),
            likeCount: likes.length,
            comments: updatedComments,
          };
        })
      );
  
      // Update comments state
      setComments((prev) => {
        const updatedComments = { ...prev };
        postDetails.forEach(({ postId, comments }) => {
          if (postId) {
            updatedComments[postId] = comments;
          }
        });
        return updatedComments;
      });
  
      // Update like status state
      setLikeStatus((prev) => {
        const updatedStatus = { ...prev };
        postDetails.forEach(({ postId, isLiked, likeCount }) => {
          if (postId) {
            updatedStatus[postId] = { isLiked, likeCount };
          }
        });
        return updatedStatus;
      });
    } catch (error) {
      console.error('Failed to initialize posts:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchedPosts, loggedIn]);
  

  // Trigger initialization when dependencies change
  useEffect(() => {
    initializePosts();
  }, [initializePosts]);
};

export default usePostInitialization;