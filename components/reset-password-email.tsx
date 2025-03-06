import React from "react";

interface ResetPasswordEmailProps {
  email: string;
  resetPasswordToken: string;
}

const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  email,
  resetPasswordToken,
}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">
        Reset Password <b>${email}</b>
      </h1>
      <p className="text-sm">Click the link below to reset your password</p>
      <a
        href={`https://pithy-platform.vercel.app/reset-password?resetToken=${resetPasswordToken}`}
        className="text-blue-500 underline"
      >
        Reset Password
      </a>
    </div>
  );
};

export default ResetPasswordEmail;
