export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-5">
      <h1 className="text-2xl font-bold mb-4">You are offline</h1>
      <p className="text-gray-600">
        Please check your internet connection and try again.
      </p>
    </div>
  );
}
