"use client";

import React, { useState, useEffect } from "react";
import Posts from "./Posts";
import { CircleUserRound } from "lucide-react";
import { Button } from "./ui/button";
import {  usePost } from '@/context/PostContext'

const ShareSomething = () => {
  const { searchPosts, filteredPosts } = usePost();  // Get the searchPosts and filteredPosts from the context
  const [query, setQuery] = useState("");  // Add a new state to store the search query

  // Handle search
  const handleSearch = () => {
    searchPosts(query);  // Call the searchPosts function with the query
  };

  // Debounce logic for the search input
  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      if (query.trim() !== '') {
        searchPosts(query);  //Perform search when the query is not empty
      }
    }, 300);
    return () => clearTimeout(debounceSearch);

  }, [query, searchPosts]);

  return (
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
            <datalist id='autocomplete-options'>  {/* Add the datalist element */}
              {Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
                filteredPosts.slice(0, 5).map((post) => (
                  <option key={post.post_id} value={`${post.content}`} />
                ))
              ) : (
                <option value="No results found" disabled />
              )}
            </datalist>

            {/* Button */}
            <Button
              className="bg-gradient-to-t from-[#5AC35A] to-[#00AE76] text-white rounded-lg py-1 px-2 flex-shrink-0 hover:bg-gradient-to-tr from[#]"
              onClick={handleSearch}// search posts when the button is clicked
            >
              Post
            </Button>
    
          </div>
        </div>

        {/* Scrollable Posts Section */}
        <div className="flex-1  w-full no-scrollbar mt-4 max-w-3xl overflow-y-auto h-screen ">
          {/* <Posts posts={filteredPosts} /> */}
          <Posts />
        </div>
      </div>




  );
};

export default ShareSomething;
