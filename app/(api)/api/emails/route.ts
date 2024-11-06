import { Resend } from "resend";
import { NextResponse } from "next/server";

// Create a Resend instance using the API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Parse the JSON request body

    const { name, email, phone, message } = body; // Extract form data

    // Send the email using Resend
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // Replace with your sender email
      to: "bandonkeyea@gmail.com", // Replace with your target email
      subject: "New Contact Form Submission",
      react: `Hello, I'm ${name} and I have a message for you: ${message}. You can reach me at ${phone} or ${email}.`,
    });

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
      response,
    });
  } catch (error) {
    // Handle errors (e.g., email not sent)
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email", error },
      { status: 500 },
    );
  }
}
