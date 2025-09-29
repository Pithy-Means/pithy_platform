"use client";

import Image from "next/image";
import { useState } from "react";

const items = [
  {
    id: 1,
    title: "Take A Course",
    description: "Be guided through Our Module",
    image: "/assets/Frame 87.png",
    accent: "from-[#5AC35A]"
  },
  {
    id: 2,
    title: "Take Our Guidance",
    description: "Answer a series of questions",
    image: "/assets/Frame 88.png",
    accent: "from-[#4DB84D]"
  },
  {
    id: 3,
    title: "Get personalized results",
    description: "receive a customized report",
    image: "/assets/C05_6.png",
    accent: "from-[#00AE76]"
  },
  {
    id: 4,
    title: "Explore and take action",
    description: "review your results & explore recommendations",
    image: "/assets/report.png",
    accent: "from-[#009B68]"
  },
]
export default function RandomGridCards() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group relative"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            {/* Card Container */}
            <div className={`
              relative bg-white rounded-2xl overflow-hidden
              transition-all duration-500 ease-out
              ${hoveredId === item.id ? 'shadow-2xl -translate-y-2 scale-[1.02]' : 'shadow-lg'}
              border border-gray-100
            `}>
              
              {/* Gradient Accent Line */}
              <div className={`
                h-1.5 w-full bg-gradient-to-r ${item.accent} to-[#00AE76]
                transition-all duration-500
                ${hoveredId === item.id ? 'h-2' : 'h-1.5'}
              `} />
              
              {/* Content Container */}
              <div className="p-6 pb-8">
                {/* Number Badge */}
                <div className={`
                  inline-flex items-center justify-center
                  w-10 h-10 rounded-full mb-4
                  bg-gradient-to-br ${item.accent} to-[#00AE76]
                  transition-all duration-500
                  ${hoveredId === item.id ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}
                `}>
                  <span className="text-white font-bold text-sm">{item.id}</span>
                </div>

                {/* Title */}
                <h3 className={`
                  text-xl font-bold text-gray-900 mb-3
                  transition-colors duration-300
                  ${hoveredId === item.id ? 'text-[#00AE76]' : 'text-gray-900'}
                `}>
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[40px]">
                  {item.description}
                </p>

                {/* Image Container */}
                <div className={`
                  relative flex items-center justify-center
                  h-24 w-full rounded-xl
                  bg-gradient-to-br from-gray-50 to-gray-100
                  transition-all duration-500
                  ${hoveredId === item.id ? 'bg-gradient-to-br from-[#5AC35A]/5 to-[#00AE76]/5' : ''}
                `}>
                  <div className={`
                    transition-transform duration-500 ease-out
                    ${hoveredId === item.id ? 'scale-110' : 'scale-100'}
                  `}>
                    <Image
                      src={item.image || "/assets/Frame 87.png"}
                      alt={item.title}
                      width={80}
                      height={80}
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className={`
                absolute inset-0 rounded-2xl pointer-events-none
                bg-gradient-to-br ${item.accent} to-[#00AE76] opacity-0
                transition-opacity duration-500
                ${hoveredId === item.id ? 'opacity-5' : 'opacity-0'}
              `} />
            </div>

            {/* Subtle Bottom Accent */}
            <div className={`
              absolute -bottom-1 left-1/2 -translate-x-1/2
              w-3/4 h-1 rounded-full
              bg-gradient-to-r ${item.accent} to-[#00AE76]
              transition-all duration-500
              ${hoveredId === item.id ? 'opacity-30 w-full' : 'opacity-0 w-3/4'}
            `} />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}