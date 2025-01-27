/* eslint-disable react-hooks/exhaustive-deps */
import { PostWithUser, CommentPost, LikePost } from '@/types/schema';
import { useCallback, useEffect } from 'react';
import { getLikesByPostId, getCommentsByPostId } from '../actions/user.actions';

// Memoized initialization function
const usePostInitialization = (
  posts: PostWithUser[], 
  loggedIn: { user_id: string } | null,
  setPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>,
  setComments: React.Dispatch<React.SetStateAction<{ [key: string]: CommentPost[] }>>,
  setLikeStatus: React.Dispatch<React.SetStateAction<{ [key: string]: { isLiked: boolean; likeCount: number } }>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const initializePosts = useCallback(async () => {
    // Early return if no posts
    if (!posts.length) return;

    try {
      setLoading(true);

      // Deduplicate and merge posts
      setPosts((prevPosts) => {
        const existingIds = new Set(prevPosts.map((post) => post.post_id));
        const newPosts = posts.filter(
          (post) => !existingIds.has(post.post_id)
        );
        return [...prevPosts, ...newPosts.reverse()];
      });

      // Batch fetch likes and comments
      const postDetails = await Promise.all(
        posts.map(async (post) => {
          const [likes, comments] = await Promise.all([
            getLikesByPostId(post.post_id || ''),
            getCommentsByPostId(post.post_id || '')
          ]);

          return {
            postId: post.post_id,
            isLiked: likes.some((like: LikePost) => like.user_id === loggedIn?.user_id),
            likeCount: likes.length,
            comments
          };
        })
      );

      // Update comments
      setComments((prev) => {
        const updatedComments = { ...prev };
        postDetails.forEach(({ postId, comments }) => {
          if (postId) {
            updatedComments[postId] = comments;
          }
        });
        return updatedComments;
      });

      // Update like status
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
      // Optionally set an error state
    } finally {
      setLoading(false);
    }
  }, [posts, loggedIn]);

  // Trigger initialization when dependencies change
  useEffect(() => {
    initializePosts();
  }, [initializePosts]);
};

export default usePostInitialization;