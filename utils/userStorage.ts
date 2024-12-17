import axios from "axios";

/**
 * Store user data by calling the backend API.
 * @param userId - The ID of the user.
 * @param postId - The ID of the post.
 * @param fileId - The ID of the uploaded file.
 */
export async function storeUserData(userId: string, postId: string, fileId: string) {
  try {
    const response = await axios.post("/api/userStorage", {
      userId,
      postId,
      fileId,
    });
    console.log("User data stored:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error storing user data:", error);
    throw error;
  }
}

/**
 * Fetch user-specific data by calling the backend API.
 * @param userId - The ID of the user whose data to fetch.
 */
export async function fetchUserData(userId: string) {
  try {
    const response = await axios.get(`/api/userStorage?userId=${userId}`);
    console.log("User data fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}
