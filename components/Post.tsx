'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { AiFillLike } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { FaComments } from "react-icons/fa6";
import { FaRegCommentDots } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegShareFromSquare } from "react-icons/fa6";
import InfiniteScroll from 'react-infinite-scroll-component';

type Post = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  imageUrl: string;
  likes: number;
  comments: number;
  shares: number;
};

const Post = () => {
  //state for storing the posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [postCount, setPostCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  //function to simulate API call for fetching posts
  const fetchMorePosts = useCallback(() => {
    //simulate user posts
    const users = [
      { name: 'Doreen Iklay', avatar: '/assets/person_feedback.png', },
      { name: 'John Doe', avatar: '/assets/person_feedback.png', },
      { name: 'Jane Doe', avatar: '/assets/person_feedback.png', },
    ];

    setTimeout(() => {
      const newPosts = Array(5).fill(null).map((_, index) => {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        //return a new post object
        return {
          id: postCount + index + 1,
          // title: `Post ${postCount + index + 1}`,
          author: randomUser.name,
          avatar: randomUser.avatar,
          time: '23 Minutes ago',
          content: 'It’s intriguing, finding out that the career path, taken by most of that , freshly graduated student is as confusing as you could imagine due to the...',
          imageUrl: '/assets/post_image.png',
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 10),
        };
      });
      //update the posts state with the new posts
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPostCount((prevCount) => prevCount + newPosts.length);

      //set hasMore to false when the total number of posts is 50
      if (postCount + newPosts.length >= 50) {
        setHasMore(false);
        setIsLoading(false);
      }
    }, 1000);
  }, [postCount, setPosts, setPostCount, setIsLoading]);

  //initial fetch of posts
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
        isLoading
      )
        return;
      setIsLoading(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

  }, [fetchMorePosts, isLoading]);

  return (
    <div className='flex flex-col items-center overflow-y-scroll no-scrollbar' >
      {/* <h2 className="text-2xl mb-4">Showing {postCount} Posts</h2> */}
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={<h4>Loading more posts ...</h4>}
        endMessage={<p>No more posts available.</p>}
        className='w-full'
        scrollableTarget='scrollableDiv'
      >
        {posts.map((post) => (
          <div key={post.id} className='flex flex-col bg-white  text-black px-6 justify-center  p-2 mx-6 mb-4'>
            <div className=''>
              <div className=' flex flex-row gap-2'>
                <Image src='/assets/person_feedback.png'
                  width={40}
                  height={40}
                  alt='person'
                  className=' rounded-lg' />
                <div className='flex flex-col'>
                  <p className='font-semibold'>{post.author}</p>
                  <p className='text-sm text-gray-500'>{post.time}</p>
                </div>
              </div>
              <div>
                <p className='text-base p-2 '>I{post.content}<span className='text-bold'>...see more</span></p>
              </div>
              <div className='flex flex-col items-center'>
                <Image src={post.imageUrl}
                  width={600}
                  height={300}
                  alt='Post person'
                  className=' rounded-sm items-center object-cover'
                />
                <div className='flex  space-x-80'>
                  <div className='flex flex-row p-2 ml-[-20px] '>
                    <AiFillLike />
                    <FcLike />
                    <FaComments />
                    <p>{post.likes}</p>
                  </div>
                  <div className='flex flex-row items-center justify-end gap-4'>
                    <p>{post.comments} Comments</p>
                    <p>{post.shares} Shared</p>

                  </div>
                </div>
              </div>
              <div className='flex flex-row justify-start gap-8 '>
                <div>
                  <Image src='/assets/person_feedback.png'
                    width={40}
                    height={40}
                    alt='person'
                    className=' rounded-lg' />

                </div>
                <div className='flex items-center gap-8'>
                  <div className='items-center'>
                    <FcLike size={20} />
                    <p>Like</p>
                  </div>
                  <div className='flex flex-col items-center'>
                    <FaRegCommentDots size={16} />
                    <p>Comment</p>
                  </div>
                  <div className='flex flex-col items-center' >
                    <BiRepost size={20} />
                    <p>Repost</p>
                  </div>
                  <div className='flex flex-col items-center'>
                    <FaRegShareFromSquare size={16} />
                    <p>Share</p>
                  </div>

                </div>
              </div>

            </div>

          </div>
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default Post