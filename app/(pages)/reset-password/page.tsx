// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";

// const ResetPassword = () => {
//   const [email, setEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const router = useRouter();

//   const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       // Call your API to send the password reset link
//       const response = await fetch("/api/send-reset-link", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to send reset link. Please try again.");
//       }

//       setSuccessMessage("A password reset link has been sent to your email.");
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : "An error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       // Call your API to reset the password
//       const response = await fetch("/api/reset-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ newPassword }),
//         setNewPassword(); // Include a token if required
//       });

//       if (!response.ok) {
//         throw new Error("Failed to reset password. Please try again.");
//       }

//       setSuccessMessage("Your password has been successfully reset.");
//       router.push("/login"); // Redirect to the login page after successful reset
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : "An error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
//         {successMessage && <div className="text-green-500">{successMessage}</div>}
//         {errorMessage && <div className="text-red-500">{errorMessage}</div>}

//         {/* If using email to send reset link */}
//         <form onSubmit={handleEmailSubmit}>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded p-2"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
//             disabled={loading}
//           >
//             {loading ? <Loader2 size={16} className="animate-spin" /> : "Send Reset Link"}
//           </button>
//         </form>

//         {/* If resetting password directly */}
//         {/* Uncomment if you're using a token for direct password reset */}
//         {/* <form onSubmit={handlePasswordReset}>
//           <div className="mb-4">
//             <label htmlFor="newPassword" className="block text-sm font-medium">
//               New Password
//             </label>
//             <input
//               type="password"
//               id="newPassword"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded p-2"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
//             disabled={loading}
//           >
//             {loading ? <Loader2 size={16} className="animate-spin" /> : "Reset Password"}
//           </button>
//         </form> */}
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
