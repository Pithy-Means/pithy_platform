import React from "react";
import { Card } from "@/components/ui/card";

const ThankYouMessage = () => {
  return (
    <Card className="bg-[#5AC35A] py-10 px-6 w-full flex justify-center items-center">
      <div className="flex flex-col space-y-8">
        <h3 className="text-black text-5xl font-extrabold capitalize">
          Thank you
        </h3>
        <div className="flex flex-col space-y-2 items-center">
          <div className="bg-[#1111116c] h-1 w-full rounded" />
          <p className="text-black capitalize">
            We&apos;ll be in touch soon
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ThankYouMessage;