// import OurImpact from "@/components/OurImpact";
import OurStory from "@/components/OurStory";
// import Partnerships from "@/components/Partnerships";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Pithy Means, our story, partnerships, and impact.",
  keywords: ["Pithy Means", "about us", "our story", "partnerships", "impact"],
  openGraph: {
    title: "About Us",
    description: "Learn more about Pithy Means, our story, partnerships, and impact.",
    url: "https://www.pithymeans.com/about",
    siteName: "Pithy Means",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Pithy Means - Empowering Individuals",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us",
    description: "Learn more about Pithy Means, our story, partnerships, and impact.",
    images: ["/opengraph-image.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Modern Hero Section */}
      <div className="relative w-full min-h-[75vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#5AC35A] rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-[#00AE76] rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        ></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[75vh] px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-2 h-2 rounded-full bg-[#5AC35A] animate-pulse"></div>
            <span className="text-sm text-gray-300 font-medium">Your Journey to Success Starts Here</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-center mb-6 max-w-5xl">
            <span className="text-white">Discover Yourself.</span>
            <br />
            <span className="bg-gradient-to-r from-[#5AC35A] via-[#00AE76] to-[#5AC35A] bg-clip-text text-transparent">
              Begin Your Success.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 text-center max-w-2xl mb-10 leading-relaxed">
            True success begins with self-discovery. We help you uncover your strengths, passions, and purpose—the foundation for building the life you envision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a
              href="#our-story"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105"
            >
              <span className="relative z-10">Start Your Discovery</span>
            </a>
            <a
              href="#impact"
              className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              Learn Our Approach
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full max-w-7xl mx-auto px-4 -mt-20 mb-20 z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: "Self-Awareness", label: "Foundation of Growth" },
            { value: "Your Strengths", label: "Unique Potential" },
            { value: "Clear Purpose", label: "Path to Success" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="text-2xl font-bold bg-gradient-to-r from-[#5AC35A] to-[#00AE76] bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div id="our-story" className="w-full">
        <OurStory />
      </div>
      {/* <Partnerships />
      <OurImpact /> */}
      <Footer />
    </div>
  );
}