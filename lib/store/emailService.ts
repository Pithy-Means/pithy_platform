// lib/emailService.js

/**
 * Send contact form data to the API endpoint
 * @param {Object} formData - Contact form data
 * @param {string} formData.name - User's name
 * @param {string} formData.email - User's email
 * @param {string} formData.phone - User's phone number
 * @param {string} formData.message - User's message
 * @returns {Promise<boolean>} - True if email was sent successfully
 */
interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const sendContactEmail = async (
  formData: FormData,
): Promise<boolean> => {
  try {
    const res = await fetch("/api/emails/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error("Error in emailService:", error);
    throw error;
  }
};
