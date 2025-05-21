export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">You&apos;re offline</h1>
      <p className="mb-6">Please check your internet connection and try again.</p>
      <button
        // onClick={() => window.location.reload()}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Try Again
      </button>
    </div>
  );
}