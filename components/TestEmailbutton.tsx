import { sendEmail } from "@/lib/actions/mails/sendMails";
import React from "react";

const TestEmailbutton = () => {
  const handleSubmit = async () => {
    const res = await sendEmail({
      from: "onboarding@resend.dev",
      to: ["pithymeansads@gmail.com"],
      subject: "Test Email",
      html: "<h1>Hello, this is a test email from Great.</h1>",
    });
    return res;
  };
  return (
    <button className="bg-black px-10 rounded py-2" onClick={handleSubmit}>
      Send Test Email
    </button>
  );
};

export default TestEmailbutton;
