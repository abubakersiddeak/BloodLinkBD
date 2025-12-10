"use client";

import { Suspense } from "react";
import PaymentSuccessPage from "./component/PaymentSuccessPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
