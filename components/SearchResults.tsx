import React from "react";
import { Avatar } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
// import Link from "next/link";
// import { HeartIcon, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import { PostWithUser } from "@/types/schema";

interface SearchResultsProps {
  searchPosts: PostWithUser[];
  loading?: boolean;
  searchTerm?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  searchPosts, 
  loading = false,
  searchTerm = "" 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5AC35A]"></div>
      </div>
    );
  }

  if (searchPosts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center my-4">
        <h3 className="text-lg font-medium text-gray-700">No results found</h3>
        <p className="text-gray-500 mt-2">
          No posts matching &quot;{searchTerm}&quot; were found. Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold px-4">Search Results</h2>
      
      {searchPosts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
          {/* Post Header */}
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-10 w-10">
              {post.user?.firstname && (
                <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-500">
                  {(post.user.firstname || "U")[0].toUpperCase()}
                </div>
              )}
            </Avatar>
            <div>
              <p className="text-xs text-gray-500">
                {post!.$createdAt ? formatDistanceToNow(new Date(post!.$createdAt), { addSuffix: true }) : "Recently"}
              </p>
            </div>
          </div>
          
          {/* Post Content */}
          <div className="mb-4">
            <p className="text-gray-800 whitespace-pre-wrap break-words">
              {post.content}
            </p>
          </div>
          
          {/* Post Media */}
          {post.image && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <Image 
                src={post.image} 
                alt="Post image" 
                width={500} 
                height={300} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          {post.video && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <video 
                src={post.video} 
                controls 
                className="w-full h-auto"
              />
            </div>
          )}
          
          {/* Post Actions */}
          {/* <div className="flex items-center justify-between text-gray-500 pt-3 border-t border-gray-100">
            <button className="flex items-center space-x-1 hover:text-[#5AC35A]">
              <HeartIcon size={18} />
              <span>{post.post_id || 0}</span>
            </button>
            
            <button className="flex items-center space-x-1 hover:text-[#5AC35A]">
              <MessageCircle size={18} />
              <span>{post.commentsCount || 0}</span>
            </button>
            
            <button className="flex items-center space-x-1 hover:text-[#5AC35A]">
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default SearchResults;