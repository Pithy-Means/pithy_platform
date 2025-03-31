import { Resend } from "resend";
import { NextResponse } from "next/server";
import env from "../../../../env";

// Create a Resend instance using the API key
const resend = new Resend(env.emails.apikey);

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Parse the JSON request body

    const { name, email, phone, message } = body; // Extract form data

    // Send the email using Resend
    const response = await resend.emails.send({
      from: "Management <management@pithymeansplus.com>",
      to: "management@pithymeansplus.com", // Replace with your target email
      replyTo: email,
      subject: "New Contact Form Submission",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you For Contacting Pithy Means Plus</title>
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
                <p><strong>Submitted By:</strong> ${name}</p>
                <p><strong>User Email:</strong> ${email}</p>
                <p><strong>User Phone:</strong>${phone}</p>
              </div>

              <h2>Question Details</h2>
              <div class="question">
                <p>${message}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent:", response);

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
