import { Loader } from "@/components/loader";
import { Suspense } from "react";
import RegisterAccount from "./components/signup-form";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <RegisterAccount />
    </Suspense>
  );
}
