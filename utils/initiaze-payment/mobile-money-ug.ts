import { PaymentData, PaymentResponse } from "@/types/schema";

export async function initiatePayment(paymentData: PaymentData): Promise<void> {
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

    if (result.status === 'success' && result.redirect) {
      // Redirect the user to the authorization URL
      window.location.href = result.redirect;
    } else if (result.status === 'success') {
      // Handle success without redirect
      console.log('Payment initialized successfully', result.data);
    } else {
      // Handle error response
      console.error('Payment initiation error:', result.message);
    }
  } catch (error) {
    console.error('Error in initiatePayment:', (error as Error).message);
  }
}