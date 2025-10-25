import { Loader } from "@/components/loader";
import { Suspense } from "react";
import ShoperRegisterAccount from "./components/signup-form";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <ShoperRegisterAccount />
    </Suspense>
  );
}
