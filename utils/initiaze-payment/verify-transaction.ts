const verifyTransaction = async (tx_ref: string) => {
  const res = await fetch("api/proxy-flutterwave/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tx_ref }),
  });

  const data = await res.json();

  if (data.status === "success") {
    console.log("Payment verified successfully", data.data);
    return data.redirect;
  } else {
    console.error("Payment verification failed", data.message);
  }
};

export { verifyTransaction };
