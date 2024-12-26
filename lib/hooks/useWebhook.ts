import { useState } from "react";

export const useWebHook = () => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [ transactions, setTransactions ] = useState<null>(null);
  const [ error, setError ] = useState<null | string>(null);

  const fetchTransactions = async (tx_ref: string) => {
    setIsVerifying(true);
    try {
      const response = await fetch(`/api/proxy-flutterwave/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tx_ref }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setTransactions(data.data);
      } else {
        setError(data.message || 'Error fetching transaction');
      }
    } catch (error) {
      setError('An error occurred while fetching transaction');
      console.log('Error fetching transaction', error)
    } finally {
      setIsVerifying(false);
    }
  };

  return { isVerifying, transactions, error, fetchTransactions };
};