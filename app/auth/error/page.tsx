"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

// Define all possible error types
type AuthErrorType =
  | "Configuration"
  | "AccessDenied"
  | "Verification"
  | "CredentialsSignin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "SessionRequired"
  | "Default";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error") as AuthErrorType | null;

  // Complete error messages mapping
  const errorMessages: Record<AuthErrorType, string> = {
    Configuration: "Server configuration error",
    AccessDenied: "Access denied",
    Verification: "Verification failed",
    CredentialsSignin: "Invalid email or password",
    OAuthSignin: "OAuth sign-in error",
    OAuthCallback: "OAuth callback error",
    OAuthCreateAccount: "Could not create OAuth account",
    EmailCreateAccount: "Could not create email account",
    Callback: "Callback error",
    OAuthAccountNotLinked: "This email is already in use with another provider",
    SessionRequired: "You must be signed in to access this page",
    Default: "An authentication error occurred",
  };

  useEffect(() => {
    // Clean the URL after displaying the error
    if (error && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState(null, "", url.toString());
    }

    // If no error, redirect to login after a delay
    if (!error) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  // If no error found, show a generic message
  if (!error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-center text-red-600">
            Authentication Error
          </h2>
          <p className="text-center">
            No error details available. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center text-red-600">
          Authentication Error
        </h2>
        <p className="text-center">
          {errorMessages[error] || errorMessages["Default"]}
        </p>
        <div className="flex flex-col space-y-4 items-center">
          <Link
            href="/login"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </Link>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-100 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
