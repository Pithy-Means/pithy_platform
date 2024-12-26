import MobileMoney from "@/components/MobileMoney";
import React, { Suspense } from "react";

const Payment = () => {
  return (
    <div>
      <Suspense>
        <MobileMoney />
      </Suspense>
    </div>
  );
};

export default Payment;
