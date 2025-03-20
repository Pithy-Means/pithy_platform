"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const comments = [
  {
    id: 1,
    name: "Alice Johnson",
    text: "This platform is amazing! Highly recommended.",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Michael Smith",
    text: "A wonderful experience using this service.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Samantha Lee",
    text: "Great customer support and seamless UI.",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    name: "David Brown",
    text: "Absolutely love the intuitive design!",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    name: "Jessica White",
    text: "Fast, reliable, and easy to use.",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: 6,
    name: "Chris Taylor",
    text: "Very satisfied with the service.",
    avatar: "https://randomuser.me/api/portraits/mens/3.jpg",
  },
  {
    id: 7,
    name: "Emily Davis",
    text: "The best platform I have ever used!",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: 8,
    name: "John Wilson",
    text: "Highly recommended to everyone!",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
  },
];

export default function SlidingComments() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
      if (
        scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
        scrollRef.current.scrollWidth
      ) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <div className="relative w-full max-w-4xl mx-auto overflow-hidden p-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <Button
            onClick={() => scroll(-300)}
            className="rounded-full bg-white shadow-md p-2"
          >
            <ChevronLeft size={24} />
          </Button>
        </div>

        <motion.div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              className="min-w-[300px] h-64 p-6 rounded-2xl shadow-lg bg-white flex flex-col justify-center items-center text-gray-800 border"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={comment.avatar}
                alt={comment.name}
                width={64}
                height={64}
                unoptimized
                className="w-16 h-16 rounded-full mb-4"
              />
              <h2 className="text-lg font-bold">{comment.name}</h2>
              <p className="text-sm text-center mt-2">{comment.text}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <Button
            onClick={() => scroll(300)}
            className="rounded-full bg-white shadow-md p-2"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
      </div>
    </>
  );
}
