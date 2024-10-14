import React from 'react'
import Image from 'next/image'
import { AiFillLike } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { FaComments } from "react-icons/fa6";
import { FaRegCommentDots } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegShareFromSquare } from "react-icons/fa6";

const Post = () => {
  return (
    <div>
      <div className='flex flex-col bg-white  text-black px-6 justify-center h-full w-3/5 p-2 mx-6 '>
        <div className=''>
          <div className=' flex flex-row gap-1'>
            <Image src='/assets/person_feedback.png'
              width={40}
              height={40}
              alt='person'
              className=' rounded-lg' />
            <p>Doreen Iklay <br />23 Minutes ago</p>
          </div>
          <div>
            <p className='text-base p-2 '>It’s intriguing, finding out that the career path, taken by most of that , freshly graduated student is as confusing as you could imagine due <span className='text-bold'>...see more</span></p>
          </div>
          <div className='flex flex-col items-center'>
            <Image src='/assets/post_image.png'
              width={600}
              height={300}
              alt='Post person'
              className=' rounded-sm items-center object-cover' />
            <div className='flex justify-evenly  '>
              <div className='flex flex-row  p-2'>
                <AiFillLike />
                <FcLike />
                <FaComments />
                <p>78</p>
              </div>
              <div className='flex flex-row items-center justify-end gap-4'>
                  <p>10 Comments</p>
                  <p>2 Shared</p>
                 
              </div>
            </div>
          </div>
          <div className='flex flex-row justify-evenly'>
            <div>
              <Image src='/assets/person_feedback.png'
                width={40}
                height={40}
                alt='person'
                className=' rounded-lg' />

            </div>
            <div>
              <FcLike />
              <p>Like</p>
            </div>
            <div>
              <FaRegCommentDots />
              <p>Comment</p>
            </div>
            <div>
              <BiRepost />
              <p>Repost</p>
            </div>
            <div>
              <FaRegShareFromSquare />
              <p>Share</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Post