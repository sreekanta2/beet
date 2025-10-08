"use client";
import { Button } from "@/components/ui/button";
import lightImage from "@/public/images/error/light-401.png";
import Image from "next/image";
const ErrorPage = () => {
  const reset = () => {
    window.location.reload();
  };
  return (
    <div className="h-screen    flex justify-center items-center p-10">
      <div className="w-full flex flex-col items-center">
        <div className="max-w-[542px]">
          <Image
            src={lightImage}
            alt="error image"
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="mt-16 text-center">
          <div className="text-2xl md:text-2xl lg:text-2xl font-semibold text-destructive-700">
            Opps! something went wrong!
          </div>

          <Button onClick={() => reset()} color="destructive" size="sm">
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
