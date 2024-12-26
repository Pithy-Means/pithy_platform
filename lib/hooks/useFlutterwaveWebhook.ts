/* eslint-disable @typescript-eslint/no-explicit-any */
import { FlutterwaveWebhookData, PaymentResponse } from "@/types/schema";
import { useState, useCallback } from "react";

export const useFlutterwaveWebhook = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<PaymentResponse | null>(null);

  /**
   * Send a POST request to the webhook route
   * @param payload The data to be sent in the POST request
   */
  const sendWebhookRequest = useCallback(async (payload: FlutterwaveWebhookData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/proxy-flutterwave/flw-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log("Webhook response: ", response);

      const result = await response.json();
      console.log("Webhook result: ", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to verify payment.");
      }

      setResponse(result);
      console.log("✅ Webhook response: ", result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("❌ Error sending webhook request: ", err.message);
      } else {
        setError("An unknown error occurred.");
        console.error("❌ Error sending webhook request: ", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sendWebhookRequest,
    loading,
    error,
    response,
  };
};
