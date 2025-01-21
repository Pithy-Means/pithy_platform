"use client";

import React, { useState } from "react";
import Posts from "./Posts";
import { CircleUserRound } from "lucide-react";
import { Button } from "./ui/button";
import { PostsProvider, usePost } from '@/context/PostContext'

const ShareSomething = () => {
  const { searchPosts, filteredPosts } = usePost(); //Destructure the searchPosts function and the filterdPosts state
  const [query, setQuery] = useState('');  //Create a new state to store the search query

  const handleSearch = () => {
    if (!query || query.trim() === "") {
      console.error("Search query is empty.");
      return;
    }
    searchPosts(query.trim());  //Trigger the searchPosts function with the query
  }

  return (
    <PostsProvider>
      <div className="flex flex-col no-scrollbar items-center justify-center min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col bg-white text-black rounded-lg shadow-md p-2 w-full mt-2  ">
          <div className="flex items-center justify-center">
            {/* Icon */}
            <CircleUserRound size={32} className="flex-shrink-0 text-gray-600 hidden md:block" />

            {/* Input */}
            <input
              type="text"
              placeholder="Search Posts"
              className="border border-gray-300 rounded-lg flex-1 py-1 mx-2  px-2 focus:outline-none focus:ring-2 focus:ring-[#5AC35A]  "
              value={query} // Add the value property
              onChange={(e) => setQuery(e.target.value)} // Open modal when the input is clicked
              list='autocomplete-options' // Add the list attribute
            />

            {/* Autocomplete suggestions */}
            <datalist id='autocomplete-options'> {/* Add the datalist element */}
              {filteredPosts && filteredPosts.length > 0 ? (
                filteredPosts.slice(0, 5).map((post) => (
                  <option key={post.post_id} value={`${post.content} by ${post.user.firstname}`} />
                ))
              ) : (
                <option value="No results found" disabled />
              )}
            </datalist>

            {/* Button */}
            <Button
              className="bg-gradient-to-t from-[#5AC35A] to-[#00AE76] text-white rounded-lg py-1 px-2 flex-shrink-0"
              onClick={handleSearch} // search posts when the button is clicked
            >
              Post
            </Button>
            {/* console.log(`&apos;`filteredPosts`&apos;`, filteredPosts) */}
          </div>
        </div>

        {/* Scrollable Posts Section */}
        <div className="flex-1  w-full no-scrollbar mt-4 max-w-3xl overflow-y-auto h-screen ">
          <Posts />
          {/* {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Posts key={post.post_id} post={post} />
            ))
          ) : (
            <p className="text-gray-500 text-center">No results found. Try searching for a different query.</p>
          )} */}
        </div>
      </div>

    </PostsProvider>
  );
};

export default ShareSomething;
