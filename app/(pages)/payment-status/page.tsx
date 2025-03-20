import { Suspense } from "react";
import PaymentStatus from "@/components/PayStatus";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentStatus />
    </Suspense>
  );
};

export default Page;
