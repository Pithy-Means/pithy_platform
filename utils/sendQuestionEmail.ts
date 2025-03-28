"use server";

import { Resend } from "resend";
import env from "@/env";

// Initialize Resend with your API key
const resend = new Resend(env.emails.apikey);

// Type for email sending parameters
type SendQuestionEmailParams = {
  questionId: string;
  questionText: string;
  userId: string;
  userName: string;
  userEmail: string;
};

// Function to send email notification
export async function sendQuestionEmail({
  questionId,
  questionText,
  userId,
  userName,
  userEmail,
}: SendQuestionEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Management <management@pithymeansplus.com>`,
      to: "management@pithymeansplus.com",
      replyTo: userEmail,
      subject: `New Question Submitted - ID: ${questionId}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Question Submitted</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: white;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #2c3e50;
              color: white;
              padding: 15px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              margin-top: 20px;
            }
            .detail {
              background-color: #f9f9f9;
              border-left: 4px solid #3498db;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #777;
              margin-top: 20px;
              font-size: 12px;
            }
            .question {
              font-style: italic;
              color: #2c3e50;
              border-left: 3px solid #e74c3c;
              padding-left: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Question Submitted</h1>
            </div>
            
            <div class="content">
              <div class="detail">
                <p><strong>Question ID:</strong> ${questionId}</p>
                <p><strong>Submitted By:</strong> ${userName}</p>
                <p><strong>User ID:</strong> ${userId}</p>
                <p><strong>User Email:</strong> ${userEmail}</p>
              </div>

              <h2>Question Details</h2>
              <div class="question">
                <p>${questionText}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Instead of returning NextResponse, return a plain object
    if (error) {
      console.log("Error sending email:", error);
      return {
        success: false,
        error: "Failed to send email notification",
        message: "Failed to send email notification",
      };
    }

    return {
      success: true,
      data,
      status: 200,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Unexpected error in sendQuestionEmail:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
