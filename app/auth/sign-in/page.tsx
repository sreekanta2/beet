"use client";

import { Loader } from "@/components/loader";
import { Suspense } from "react";
import LoginForm from "./components/sign-in-content";

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginForm />
    </Suspense>
  );
}
