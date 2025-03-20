"use client";

import { useRouter } from "next/navigation";

export default function Custom403() {
  const router = useRouter();
  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{
        backgroundImage: "url('/assets/images.jpeg')",
        backgroundSize: "contain",
      }}
    >
      <div className="text-center p-8 bg-white/80 shadow-lg rounded-lg max-w-md">
        <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
        </p>

        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}
