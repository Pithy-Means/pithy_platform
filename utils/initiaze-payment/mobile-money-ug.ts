import { PaymentData, PaymentResponse } from "@/types/schema";

export async function initiatePayment(paymentData: PaymentData): Promise<PaymentResponse> {
  try {
    const response = await fetch('/api/proxy-flutterwave/mobile-money', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result: PaymentResponse = await response.json();
    return result; // Explicitly return the response
  } catch (error) {
    console.error('Error in initiatePayment:', (error as Error).message);
    throw error; // Re-throw the error for handling in the calling function
  }
}
