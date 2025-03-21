import VerifyAuth from "@/components/VerifyAuth";
import { Suspense } from "react";

const VerifyUserPage = () => {
  return (
    <Suspense>
      <VerifyAuth />
    </Suspense>
  );
};

export default VerifyUserPage;
