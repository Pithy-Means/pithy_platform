"use client";

import { useEffect, useState } from "react";
import { reset } from "@/lib/actions/user.actions";

type ResetFormData = {
  user_id: string;
  secret: string;
  password: string;
  passwordAgain: string;
};

const PasswordRecoveryForm: React.FC = () => {
  const [formData, setFormData] = useState<ResetFormData>({
    user_id: "",
    secret: "",
    password: "",
    passwordAgain: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Extract query parameters from URL using URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get("secret");
    const userId = urlParams.get("userId");

    console.log("Extracted userId:", userId); // Log extracted userId
    console.log("Extracted secret:", secret); // Log extracted secret

    // Set user_id and secret if available
    if (userId && secret) {
      setFormData((prev) => ({
        ...prev,
        user_id: userId,
        secret: decodeURIComponent(secret), // Ensure proper decoding of secret
      }));
    } else {
      console.error("Missing userId or secret in URL");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.passwordAgain) {
      setError("Passwords do not match.");
      return;
    }

    // Check if user_id and secret are set
    if (!formData.user_id || !formData.secret) {
      setError("User ID or secret is missing.");
      return;
    }

    try {
      const response = await reset(formData);
      setSuccess("Password reset successful!");
      console.log("Response:", response);
    } catch (err) {
      setError("An error occurred while resetting the password.");
      console.error("Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="password"
        name="password"
        placeholder="New Password"
        className="border p-2"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="passwordAgain"
        placeholder="Confirm New Password"
        className="border p-2 w-full"
        value={formData.passwordAgain}
        onChange={handleChange}
        required
      />
      <button type="submit">Reset Password</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};

export default PasswordRecoveryForm;
