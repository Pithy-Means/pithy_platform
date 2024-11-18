import { useRouter } from "next/navigation";

const verifyTransaction = async (tx_ref: string) => {
  const router = useRouter();
  const res = await fetch("api/proxy-flutterwave/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ tx_ref })
  })

  const data = await res.json();

  if (data.status === "success") {
    console.log("Payment verified successfully", data.data);
    router.push(data.redirect);
  } else {
    console.error("Payment verification failed", data.message);
  }
};

export { verifyTransaction };